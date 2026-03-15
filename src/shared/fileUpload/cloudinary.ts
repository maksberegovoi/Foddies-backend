import { v2 as cloudinary } from 'cloudinary'
import ApiError from '../http/errors/api.error'

type UploadedImage = {
    publicId: string
    originalUrl: string
}

const commonCloudinaryOptions = {
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    fetch_format: 'auto'
}

const responsiveImageSizes = {
    phone: {
        ...commonCloudinaryOptions,
        width: 375
    },
    tablet: {
        ...commonCloudinaryOptions,
        width: 768
    },
    desktop: {
        ...commonCloudinaryOptions,
        width: 1440
    },
    thumbnail: {
        ...commonCloudinaryOptions,
        width: 100,
        height: 100
    }
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

export const uploadToCloudinary = (
    buffer: Buffer,
    folder: string
): Promise<UploadedImage> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, unique_filename: true, overwrite: false },
            (error, result) => {
                if (error || !result) {
                    console.error('Error uploading to Cloudinary:', error)
                    return reject(ApiError.internal('Failed to upload image'))
                }
                resolve({
                    publicId: result.public_id,
                    originalUrl: result.secure_url
                })
            }
        )
        stream.end(buffer)
    })
}

export const buildResponsiveImageUrls = (
    publicId: string,
    fallbackUrl: string
) => ({
    phone: publicId
        ? cloudinary.url(publicId, {
              ...responsiveImageSizes.phone
          })
        : fallbackUrl,
    tablet: publicId
        ? cloudinary.url(publicId, {
              ...responsiveImageSizes.tablet
          })
        : fallbackUrl,
    desktop: publicId
        ? cloudinary.url(publicId, {
              ...responsiveImageSizes.desktop
          })
        : fallbackUrl,
    thumbnail: publicId
        ? cloudinary.url(publicId, {
              ...responsiveImageSizes.thumbnail
          })
        : fallbackUrl
})

export const deleteFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error)
    }
}
