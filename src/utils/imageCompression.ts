const MAX_DIMENSION = 1600;
const QUALITY = 0.85;

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

/** Downscales a photo so phone camera shots fit the upload limit. */
export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not supported');
  // JPEG has no alpha; transparent areas would otherwise turn black.
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // Safari cannot encode WebP and silently falls back to PNG.
  const webp = await canvasToBlob(canvas, 'image/webp');
  if (webp && webp.type === 'image/webp') return webp;

  const jpeg = await canvasToBlob(canvas, 'image/jpeg');
  if (!jpeg) throw new Error('Image encoding failed');
  return jpeg;
}
