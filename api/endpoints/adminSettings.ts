import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const ADMIN_SETTINGS_FILE = path.join(
  __dirname,
  '..',
  'data',
  'adminSettings.json',
);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const createDefaultSettings = () => ({
  mode: 'off',
  waitTimeMinutes: 60,
  customNote: '',
  disabledReason:
    'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.',
  disabledProductTypes: [],
  cardPaymentDeliveryEnabled: false,
  cardPaymentPickupEnabled: false,
});

if (!fs.existsSync(ADMIN_SETTINGS_FILE)) {
  fs.writeFileSync(
    ADMIN_SETTINGS_FILE,
    JSON.stringify(createDefaultSettings(), null, 2),
  );
}

router.get('/api/admin-settings', (req, res) => {
  try {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, private',
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (!fs.existsSync(ADMIN_SETTINGS_FILE)) {
      fs.writeFileSync(
        ADMIN_SETTINGS_FILE,
        JSON.stringify(createDefaultSettings(), null, 2),
      );
    }

    const data = fs.readFileSync(ADMIN_SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(data);

    if (settings.disabledReason === undefined) {
      settings.disabledReason =
        'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.';
      fs.writeFileSync(ADMIN_SETTINGS_FILE, JSON.stringify(settings, null, 2));
    }

    res.json(settings);
  } catch (error) {
    console.error('Error reading admin settings:', error);
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

router.post('/api/admin-settings', (req, res) => {
  try {
    const {
      mode,
      waitTimeMinutes,
      customNote,
      disabledReason,
      disabledProductTypes,
      cardPaymentDeliveryEnabled,
      cardPaymentPickupEnabled,
    } = req.body;

    const validModes = ['off', 'disabled', 'waitTime', 'customNote'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    if (typeof waitTimeMinutes !== 'number' || waitTimeMinutes < 0) {
      return res.status(400).json({ error: 'Invalid waitTimeMinutes' });
    }

    if (typeof customNote !== 'string') {
      return res.status(400).json({ error: 'Invalid customNote' });
    }

    if (customNote.length > 500) {
      return res
        .status(400)
        .json({ error: 'Custom note too long (max 500 characters)' });
    }

    if (typeof disabledReason !== 'string') {
      return res.status(400).json({ error: 'Invalid disabledReason' });
    }

    if (disabledReason.length > 500) {
      return res
        .status(400)
        .json({ error: 'Disabled reason too long (max 500 characters)' });
    }

    const validProductTypes = ['pizza', 'burger', 'langos', 'sides'];
    if (disabledProductTypes && Array.isArray(disabledProductTypes)) {
      if (
        !disabledProductTypes.every((type) => validProductTypes.includes(type))
      ) {
        return res.status(400).json({ error: 'Invalid product type' });
      }
    }

    if (
      typeof cardPaymentDeliveryEnabled !== 'boolean' &&
      cardPaymentDeliveryEnabled !== undefined
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid cardPaymentDeliveryEnabled' });
    }

    if (
      typeof cardPaymentPickupEnabled !== 'boolean' &&
      cardPaymentPickupEnabled !== undefined
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid cardPaymentPickupEnabled' });
    }

    const settings = {
      mode,
      waitTimeMinutes,
      customNote,
      disabledReason,
      disabledProductTypes: disabledProductTypes || [],
      cardPaymentDeliveryEnabled: !!cardPaymentDeliveryEnabled,
      cardPaymentPickupEnabled: !!cardPaymentPickupEnabled,
    };

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(ADMIN_SETTINGS_FILE, JSON.stringify(settings, null, 2));
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving admin settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
