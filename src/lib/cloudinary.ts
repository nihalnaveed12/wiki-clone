import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: File): Promise<{ id: string, url: string }> {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'blog-images',
                    resource_type: 'image',
                    transformation: [
                        { width: 1200, height: 630, crop: 'limit' },
                        { quality: 'auto' },
                        { format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (result) {
                        resolve({
                            id: result.public_id,
                            url: result.secure_url
                        });
                    } else {
                        reject(new Error('Upload failed'));
                    }
                }
            ).end(buffer);
        });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
}