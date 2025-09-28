import { UploadApiResponse, DeleteApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import { MulterFile } from '../types/express-multer.js';
import { cloudinary } from '../Config/cloudinary.js';

/**
 * Upload a file to Cloudinary
 * @param file - The file to upload (from multer)
 * @param folder - The Cloudinary folder to upload to
 * @returns Promise resolving to the Cloudinary upload result
 */
export const uploadToCloudinary = (
  file: MulterFile, 
  folder: string = 'gym-app'
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder,
        resource_type: 'auto' 
      }, 
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('No upload result'));
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
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