import { Readable } from 'stream';

import {
	DeleteObjectCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	PutObjectCommandInput,
	PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { s3Client } from '../libs/s3Client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


@Injectable()
export class S3Service {
	async uploadFile(file: Express.Multer.File, key: string): Promise<{ uploadedFile: PutObjectCommandOutput, key: string }> {
		const fileStream = Readable.from(file.buffer);
		const uploadParams: PutObjectCommandInput = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key,
			Body: fileStream,
			ContentType: file.mimetype,
			ContentLength: file.size,
		};
		const command = new PutObjectCommand(uploadParams);
		const data = await s3Client.send(command);
		return {
			uploadedFile: data,
			key: key
		};
	}

	async getPreSignedUrl(key: string){
		const getObjectParams = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key,
		}
		const command = new GetObjectCommand(getObjectParams)
		return await getSignedUrl(s3Client, command, { expiresIn: 300 });
	}

	async deleteFile(key: string) {
		try {
			const deleteObjectParams = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: key
			}
			const command = new DeleteObjectCommand(deleteObjectParams)
			return await s3Client.send(command)
		}catch (e) {
			console.log(e)
			return new Error(e);
		}
	}

	async deleteFolder(fullPath: string) {
		try {
			const listObjectsCommand = new ListObjectsV2Command({
				Bucket: process.env.AWS_BUCKET_NAME,
				Prefix: fullPath,
			});
			const { Contents, CommonPrefixes } = await s3Client.send(listObjectsCommand);
			if (Contents && Contents.length > 0) {
				const deleteObjectsCommand = new DeleteObjectsCommand({
					Bucket: process.env.AWS_BUCKET_NAME,
					Delete: {
						Objects: Contents.map((file) => ({ Key: file.Key })),
						Quiet: true,
					},
				});
				await s3Client.send(deleteObjectsCommand);
			}

			// Рекурсивное удаление подпапок
			if (CommonPrefixes && CommonPrefixes.length > 0) {
				for (const commonPrefix of CommonPrefixes) {
					await this.deleteFolder(commonPrefix.Prefix);
				}
			}
		}catch (e){
			console.error(e);
			throw new HttpException({reason: "Something went wrong while deleting folder", error: e}, HttpStatus.BAD_GATEWAY)
		}
	}
}
