import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isMongoConnected } from '../utils/db.js';
import { requireAuth } from '../utils/auth.js';
import { Settings } from '../models/Settings.js';
import {
  createDefaultSettings,
  sanitizeDeliveryCities,
  toLocalizedText,
  VALID_MODES,
  VALID_PRODUCT_TYPES,
  type AdminSettingsPayload,
} from '../utils/settingsDefaults.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const dataDir = path.join(__dirname, '..', 'data');
const MIRROR_FILE = path.join(dataDir, 'adminSettings.json');

function ensureDataDir(): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Mongo is the source of truth; the JSON file is kept as a read-only mirror so
 * the storefront keeps working during a database outage.
 */
function writeMirror(settings: AdminSettingsPayload): void {
  try {
    ensureDataDir();
    fs.writeFileSync(MIRROR_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('⚠️ Failed to mirror admin settings to disk:', error);
  }
}

function readMirror(): AdminSettingsPayload | null {
  try {
    if (!fs.existsSync(MIRROR_FILE)) return null;
    return normalize(JSON.parse(fs.readFileSync(MIRROR_FILE, 'utf8')));
  } catch (error) {
    console.error('⚠️ Failed to read mirrored admin settings:', error);
    return null;
  }
}

function normalize(raw: Record<string, unknown>): AdminSettingsPayload {
  const defaults = createDefaultSettings();

  const skCities = sanitizeDeliveryCities(
    (raw.deliveryCities as Record<string, unknown>)?.sk,
  );
  const plCities = sanitizeDeliveryCities(
    (raw.deliveryCities as Record<string, unknown>)?.pl,
  );

  return {
    mode: VALID_MODES.includes(raw.mode as string)
      ? (raw.mode as AdminSettingsPayload['mode'])
      : defaults.mode,
    waitTimeMinutes:
      typeof raw.waitTimeMinutes === 'number' && raw.waitTimeMinutes >= 0
        ? raw.waitTimeMinutes
        : defaults.waitTimeMinutes,
    customNote: toLocalizedText(raw.customNote, defaults.customNote),
    disabledReason: toLocalizedText(
      raw.disabledReason,
      defaults.disabledReason,
    ),
    disabledProductTypes: Array.isArray(raw.disabledProductTypes)
      ? (raw.disabledProductTypes as string[]).filter((type) =>
          VALID_PRODUCT_TYPES.includes(type),
        )
      : [],
    disabledProductIds: Array.isArray(raw.disabledProductIds)
      ? (raw.disabledProductIds as string[]).filter(
          (id) => typeof id === 'string',
        )
      : [],
    cardPaymentDeliveryEnabled: !!raw.cardPaymentDeliveryEnabled,
    cardPaymentPickupEnabled: !!raw.cardPaymentPickupEnabled,
    deliveryCities: {
      sk: skCities && skCities.length ? skCities : defaults.deliveryCities.sk,
      pl: plCities && plCities.length ? plCities : defaults.deliveryCities.pl,
    },
  };
}

/**
 * First run after the Mongo migration seeds the document from whatever the old
 * file-backed store held, so production settings survive the switch.
 */
async function loadOrSeed(): Promise<AdminSettingsPayload> {
  const existing = await Settings.findOne({ key: 'default' }).lean();
  if (existing) {
    return normalize(existing as unknown as Record<string, unknown>);
  }

  const seed = readMirror() ?? createDefaultSettings();
  await Settings.create({ key: 'default', ...seed });
  console.log('🌱 Seeded admin settings document in MongoDB');
  return seed;
}

router.get('/api/admin-settings', async (req, res) => {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, private',
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (!isMongoConnected()) {
    const mirrored = readMirror();
    console.warn('⚠️ MongoDB unavailable — serving mirrored admin settings');
    return res.json(mirrored ?? createDefaultSettings());
  }

  try {
    const settings = await loadOrSeed();
    writeMirror(settings);
    res.json(settings);
  } catch (error) {
    console.error('❌ Error reading admin settings:', error);
    res.json(readMirror() ?? createDefaultSettings());
  }
});

// GET stays public — the storefront reads it on every page load.
router.post('/api/admin-settings', requireAuth, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const body = req.body ?? {};

    if (!VALID_MODES.includes(body.mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    if (typeof body.waitTimeMinutes !== 'number' || body.waitTimeMinutes < 0) {
      return res.status(400).json({ error: 'Invalid waitTimeMinutes' });
    }

    const defaults = createDefaultSettings();
    const customNote = toLocalizedText(body.customNote, {
      sk: '',
      pl: '',
    });
    const disabledReason = toLocalizedText(
      body.disabledReason,
      defaults.disabledReason,
    );

    for (const [field, value] of [
      ['customNote', customNote],
      ['disabledReason', disabledReason],
    ] as const) {
      if (value.sk.length > 500 || value.pl.length > 500) {
        return res
          .status(400)
          .json({ error: `${field} too long (max 500 characters)` });
      }
    }

    if (
      body.disabledProductTypes !== undefined &&
      (!Array.isArray(body.disabledProductTypes) ||
        !body.disabledProductTypes.every((type: string) =>
          VALID_PRODUCT_TYPES.includes(type),
        ))
    ) {
      return res.status(400).json({ error: 'Invalid product type' });
    }

    if (
      body.disabledProductIds !== undefined &&
      (!Array.isArray(body.disabledProductIds) ||
        !body.disabledProductIds.every((id: unknown) => typeof id === 'string'))
    ) {
      return res.status(400).json({ error: 'Invalid disabledProductIds' });
    }

    const skCities = sanitizeDeliveryCities(body.deliveryCities?.sk);
    const plCities = sanitizeDeliveryCities(body.deliveryCities?.pl);
    if (body.deliveryCities !== undefined && (!skCities || !plCities)) {
      return res.status(400).json({ error: 'Invalid deliveryCities' });
    }

    const settings: AdminSettingsPayload = {
      mode: body.mode,
      waitTimeMinutes: body.waitTimeMinutes,
      customNote,
      disabledReason,
      disabledProductTypes: body.disabledProductTypes || [],
      disabledProductIds: body.disabledProductIds || [],
      cardPaymentDeliveryEnabled: !!body.cardPaymentDeliveryEnabled,
      cardPaymentPickupEnabled: !!body.cardPaymentPickupEnabled,
      deliveryCities: {
        sk: skCities ?? defaults.deliveryCities.sk,
        pl: plCities ?? defaults.deliveryCities.pl,
      },
    };

    await Settings.findOneAndUpdate({ key: 'default' }, settings, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    writeMirror(settings);
    res.json({ success: true, settings });
  } catch (error) {
    console.error('❌ Error saving admin settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
