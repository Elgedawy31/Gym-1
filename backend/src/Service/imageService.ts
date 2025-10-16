import { UploadApiResponse, DeleteApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import sharp from 'sharp';
import { MulterFile } from '../types/express-multer.js';
import { cloudinary } from '../Config/cloudinary.js';

/**
 * Upload a file to Cloudinary after optimizing with Sharp
 * @param file - The file to upload (from multer)
 * @param folder - The Cloudinary folder to upload to
 * @returns Promise resolving to the Cloudinary upload result
 */
export const uploadToCloudinary = async (
  file: MulterFile,
  folder: string = 'gym-app'
): Promise<UploadApiResponse> => {
  try {
    // ✅ Optimize the image using Sharp before uploading
    const optimizedBuffer = await sharp(file.buffer)
      .resize({
        width: 1200, // Adjust width as needed
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 }) // Convert to JPEG and compress
      .toBuffer();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('No upload result'));
          resolve(result);
        }
      );

      // ✅ Stream the optimized buffer instead of the raw one
      streamifier.createReadStream(optimizedBuffer).pipe(uploadStream);
    });
  } catch (err) {
    console.error('Sharp/Cloudinary upload error:', err);
    throw err;
  }
};

/**
 * Delete a file from Cloudinary
 * @param publicId - The public ID of the file to delete
 * @returns Promise resolving to the Cloudinary deletion result
 */
export const deleteFromCloudinary = (
  publicId: string
): Promise<DeleteApiResponse> => {
  return cloudinary.uploader.destroy(publicId);
};
