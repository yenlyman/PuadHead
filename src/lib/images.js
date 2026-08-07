const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.8

// Resizes+compresses a photo before storing it as a Blob on a medication record.
// Only used for the medication-catalog photo (a handful of images, not per-day
// entries), so a hand-rolled canvas helper is enough — no image-compression library.
export async function resizeAndCompressImage(file) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('canvas.toBlob returned null'))),
      'image/jpeg',
      JPEG_QUALITY,
    )
  })
}

// Firestore can't store a raw Blob — medication photos go in as a base64 data URI
// string instead, small enough after resizeAndCompressImage to fit well within the
// 1MiB Firestore document limit. Returns e.g. "data:image/jpeg;base64,/9j/4AAQ...".
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}
