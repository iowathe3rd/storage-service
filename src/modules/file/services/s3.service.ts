import { Injectable } from '@nestjs/common';
import {
	CopyObjectCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand, PutObjectCommandInput,
	S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {

	private s3Client = new S3Client({
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		},
	});


	async uploadFile(file: Express.Multer.File, path: string) {
		const params: PutObjectCommandInput = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: `${path}/${file.originalname}`,
			Body: file.buffer,
		};
		return await this.s3Client.send(new PutObjectCommand(params));
	}

	async delete(key: string) {
		const deleteParams = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key,
		};
		return await this.s3Client.send(new DeleteObjectCommand(deleteParams));
	}

	async downloadFile(fileName: string) {
		const getLinkParams = {
			Bucket: process.env.AWS_BUCKET_NAME,
			// Add the required 'Key' parameter using the 'path' module.
			Key: fileName,
		};
		const url = await getSignedUrl(
			this.s3Client,
			new GetObjectCommand(getLinkParams),
			{ expiresIn: 1 },
		);
		return url;
	}

	async renameFile(oldName: string, newName: string) {
		const extension = oldName.split('.').pop();
		const copyParams = {
			Bucket: process.env.AWS_BUCKET_NAME,
			CopySource: encodeURI(`${process.env.AWS_BUCKET_NAME}/${oldName}`),
			Key: `${newName}.${extension}`,
		};
		const deleteOldParams = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: oldName,
		};
		return await this.s3Client
			.send(new CopyObjectCommand(copyParams))
			.then(() => {
				this.s3Client.send(new DeleteObjectCommand(deleteOldParams));
			});
	}

	async createFolder(folderName: string) {
		const creteFolderParams = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: folderName + '/',
		};

		return await this.s3Client.send(
			new PutObjectCommand(creteFolderParams),
		);
	}
}
