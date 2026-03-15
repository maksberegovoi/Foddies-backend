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

export const uploadToCloudinary = async (
    filePath: string,
    folder: string
): Promise<UploadedImage> => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            unique_filename: true,
            overwrite: false
        })
        return {
            publicId: result.public_id,
            originalUrl: result.secure_url
        }
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error)
        throw ApiError.internal('Failed to upload image')
    }
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
