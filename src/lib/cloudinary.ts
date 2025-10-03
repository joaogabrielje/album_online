import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
  filename: string
): Promise<{
  public_id: string
  secure_url: string
  width: number
  height: number
  bytes: number
  format: string
}> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder,
        public_id: filename,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 2048, height: 2048, crop: 'limit' }
        ],
        overwrite: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            format: result.format,
          })
        } else {
          reject(new Error('Upload failed'))
        }
      }
    ).end(buffer)
  })
}

export const generateThumbnailUrl = (publicId: string, width = 300, height = 300) => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  })
}

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}