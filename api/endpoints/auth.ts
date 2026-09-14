import { Router } from 'express';
import { isMongoConnected } from '../utils/db.js';
import { User } from '../models/User.js';
import {
  AUTH_COOKIE,
  cookieOptions,
  hashPassword,
  requireAuth,
  signToken,
  verifyPassword,
} from '../utils/auth.js';

const router = Router();

const MIN_PASSWORD_LENGTH = 8;
const MIN_USERNAME_LENGTH = 3;

function normalizeUsername(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

router.post('/api/auth/login', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const username = normalizeUsername(req.body?.username);
    const password = String(req.body?.password ?? '');

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const user = await User.findOne({ username });

    // Same response whether the account is unknown or the password is wrong,
    // so the endpoint cannot be used to enumerate users.
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      console.warn(`🔒 Failed admin login attempt for "${username}"`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({
      sub: user._id.toString(),
      username: user.username,
    });
    res.cookie(AUTH_COOKIE, token, cookieOptions());
    res.json({ user: { username: user.username } });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(AUTH_COOKIE, { ...cookieOptions(), maxAge: undefined });
  res.json({ success: true });
});

router.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.admin?.username } });
});

router.get('/api/auth/users', requireAuth, async (_req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const users = await User.find()
      .select('username createdAt')
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      users: users.map((user) => ({
        id: String(user._id),
        username: user.username,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error('❌ Error listing users:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.post('/api/auth/users', requireAuth, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const username = normalizeUsername(req.body?.username);
    const password = String(req.body?.password ?? '');

    if (username.length < MIN_USERNAME_LENGTH) {
      return res.status(400).json({
        error: `Meno musí mať aspoň ${MIN_USERNAME_LENGTH} znaky`,
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        error: `Heslo musí mať aspoň ${MIN_PASSWORD_LENGTH} znakov`,
      });
    }

    if (await User.exists({ username })) {
      return res
        .status(409)
        .json({ error: 'Používateľ s týmto menom už existuje' });
    }

    const user = await User.create({
      username,
      passwordHash: await hashPassword(password),
    });

    console.log(
      `👤 Admin "${req.admin?.username}" created user "${username}"`,
    );
    res.status(201).json({
      user: {
        id: user._id.toString(),
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.delete('/api/auth/users/:id', requireAuth, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const id = String(req.params.id);

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (id === req.admin?.sub) {
      return res.status(400).json({ error: 'Nemôžete zmazať sám seba' });
    }

    // Losing the last account would lock everyone out of the admin for good.
    if ((await User.countDocuments()) <= 1) {
      return res
        .status(400)
        .json({ error: 'Musí zostať aspoň jeden používateľ' });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Používateľ neexistuje' });
    }

    console.log(
      `👤 Admin "${req.admin?.username}" deleted user "${deleted.username}"`,
    );
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.post('/api/auth/password', requireAuth, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const currentPassword = String(req.body?.currentPassword ?? '');
    const newPassword = String(req.body?.newPassword ?? '');

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        error: `Nové heslo musí mať aspoň ${MIN_PASSWORD_LENGTH} znakov`,
      });
    }

    const user = await User.findById(req.admin?.sub);
    if (!user) {
      return res.status(404).json({ error: 'Používateľ neexistuje' });
    }

    if (!(await verifyPassword(currentPassword, user.passwordHash))) {
      return res.status(401).json({ error: 'Súčasné heslo je nesprávne' });
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    console.log(`🔑 Admin "${user.username}" changed their password`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;
