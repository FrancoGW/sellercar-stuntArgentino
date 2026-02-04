import { v2 as cloudinary } from 'cloudinary';

/**
 * Configuración de Cloudinary para uploads de imágenes.
 */
export function getCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Faltan variables de Cloudinary en .env');
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  return cloudinary;
}

/**
 * Sube un buffer (ej. desde multipart) a Cloudinary.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{ secure_url: string; public_id: string }> {
  const cld = getCloudinaryConfig();
  return new Promise((resolve, reject) => {
    const uploadStream = cld.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        ...(publicId && { public_id: publicId }),
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result?.secure_url) return reject(new Error('Upload sin URL'));
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id ?? '',
        });
      }
    );
    uploadStream.write(buffer);
    uploadStream.end();
  });
}

/**
 * Elimina una imagen por public_id.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const cld = getCloudinaryConfig();
  await cld.uploader.destroy(publicId);
}
