import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';

// Configure Cloudinary server-side SDK
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Upload an image buffer or file string (base64/URL) to Cloudinary.
 * @param file - Base64 data string, remote URL, or file Buffer to upload
 * @param options - Cloudinary upload options (e.g. folder, public_id, tags)
 */
export async function uploadToCloudinary(
  file: string | Buffer,
  options: UploadApiOptions = {}
): Promise<UploadApiResponse> {
  const defaultOptions: UploadApiOptions = {
    folder: 'angel-tiles',
    resource_type: 'auto',
    ...options,
  };

  if (typeof file === 'string') {
    return await cloudinary.uploader.upload(file, defaultOptions);
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      defaultOptions,
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload to Cloudinary failed'));
        }
        resolve(result);
      }
    );
    uploadStream.end(file);
  });
}

/**
 * Delete an asset from Cloudinary using its public ID.
 * @param publicId - The public ID of the asset on Cloudinary
 * @param resourceType - Resource type ('image', 'raw', 'video') - defaults to 'image'
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'raw' | 'video' = 'image'
) {
  return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

/**
 * Generate optimized Cloudinary Image URL with transformations
 * @param publicId - Cloudinary public ID
 * @param options - Transformation parameters (e.g. width, height, crop, quality, format)
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: options.quality || 'auto',
    fetch_format: options.format || 'auto',
    ...options,
  });
}
