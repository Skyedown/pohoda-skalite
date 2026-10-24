import express, { Router } from 'express';
import { isMongoConnected } from '../utils/db.js';
import { requireAuth } from '../utils/auth.js';
import {
  AnnouncementImage,
  ANNOUNCEMENT_IMAGE_TYPES,
  isImageId,
  type AnnouncementImageType,
} from '../models/AnnouncementImage.js';

const router = Router();

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

function startsWith(buffer: Buffer, bytes: number[], offset = 0): boolean {
  return bytes.every((byte, index) => buffer[offset + index] === byte);
}

// Trust the file's bytes, not the client's Content-Type header.
function detectImageType(buffer: Buffer): AnnouncementImageType | null {
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png';
  }
  if (
    startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(buffer, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return 'image/webp';
  }
  return null;
}

router.post(
  '/api/announcement-image',
  requireAuth,
  express.raw({ type: [...ANNOUNCEMENT_IMAGE_TYPES], limit: MAX_IMAGE_BYTES }),
  async (req, res) => {
    try {
      if (!isMongoConnected()) {
        return res.status(503).json({ error: 'Database not available' });
      }

      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: 'Missing image' });
      }

      const contentType = detectImageType(req.body);
      if (!contentType) {
        return res.status(400).json({ error: 'Unsupported image format' });
      }

      const image = await AnnouncementImage.create({
        data: req.body,
        contentType,
      });
      res.status(201).json({ id: image.id });
    } catch (error) {
      console.error('❌ Error saving announcement image:', error);
      res.status(500).json({ error: 'Failed to save image' });
    }
  },
);

router.get('/api/announcement-image/:id', async (req, res) => {
  const { id } = req.params;
  if (!isImageId(id) || !isMongoConnected()) {
    return res.status(404).end();
  }

  try {
    // Not lean(): a lean doc holds a BSON Binary, which Buffer.from() empties.
    const image = await AnnouncementImage.findById(id);
    if (!image) return res.status(404).end();

    // Every upload gets a fresh id, so a cached copy never goes stale.
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.type(image.contentType).send(image.data);
  } catch (error) {
    console.error('❌ Error reading announcement image:', error);
    res.status(500).end();
  }
});

export default router;
