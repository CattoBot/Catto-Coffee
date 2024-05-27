import { envParseString } from '@skyra/env-utilities';
import { v2 as cloudinary } from 'cloudinary';
import { container } from '@sapphire/framework';

export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: envParseString('CLOUDINARY_CLOUD_NAME'),
            api_key: envParseString('CLOUDINARY_API_KEY'),
            api_secret: envParseString('CLOUDINARY_API_SECRET'),
        });
    }

    public async uploadImage(imagePath: string, serverId: string, folder: string = 'badges'): Promise<string> {
        const publicId = `${serverId}`;
        container.console.info(`Starting upload for image: ${imagePath} to folder: ${folder} with public ID: ${publicId}`);

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(imagePath, { folder: folder, public_id: publicId }, (error, result) => {
                if (error) {
                    container.console.info(`Error uploading image: ${imagePath} to folder: ${folder} with public ID: ${publicId}`);
                    reject(error);
                } else {
                    container.console.info(`Successfully uploaded image: ${imagePath} to folder: ${folder} with public ID: ${publicId}`);
                    resolve(result!.secure_url);
                }
            });
        });
    }

    public async deleteImage(serverId: string): Promise<void> {
        const publicId = `badges/${serverId}`;
        container.console.info(`Starting deletion for image with public ID: ${publicId}`);

        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    container.console.info(`Error deleting image with public ID: ${publicId}`);
                    reject(error);
                } else {
                    container.console.info(`Successfully deleted image with public ID: ${publicId}`);
                    resolve(result.secure_url);
                }
            });
        });
    }
}
