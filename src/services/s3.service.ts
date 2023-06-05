import { Readable } from 'stream';

import {
	CopyObjectCommand, CopyObjectCommandInput, CopyObjectCommandOutput,
	DeleteObjectCommand, DeleteObjectCommandInput,
	DeleteObjectsCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	PutObjectCommandInput,
	PutObjectCommandOutput, S3Client,
} from '@aws-sdk/client-s3';
import { BadGatewayException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { s3Client } from '../libs/s3Client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as process from 'process';

@Injectable()
export class S3Service {
	private readonly S3Client: S3Client;
	private readonly AWSBucket: string
	constructor() {
		this.S3Client = s3Client;
		this.AWSBucket = process.env.AWS_BUCKET_NAME;
	}
	async uploadFile(
		file: Express.Multer.File,
		key: string,
	): Promise<{ uploadedFile: PutObjectCommandOutput; key: string }> {
		const fileStream = Readable.from(file.buffer);
		const uploadParams: PutObjectCommandInput = {
			Bucket: this.AWSBucket,
			Key: key,
			Body: fileStream,
			ContentType: file.mimetype,
			ContentLength: file.size,
		};
		const command = new PutObjectCommand(uploadParams);
		const data = await s3Client.send(command);
		return {
			uploadedFile: data,
			key: key,
		};
	}

	async getPreSignedUrl(key: string) {
		const getObjectParams = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key,
		};
		const command = new GetObjectCommand(getObjectParams);
		return await getSignedUrl(s3Client, command, { expiresIn: 300 });
	}

	async moveFile(copySourceKey: string, newAwsKey: string): Promise<void> {
		try {
			const copyParams: CopyObjectCommandInput = {
				Bucket: this.AWSBucket,
				CopySource: `${this.AWSBucket}/${copySourceKey}`,
				Key: newAwsKey,
			};

			const deleteParams: DeleteObjectCommandInput = {
				Bucket: this.AWSBucket,
				Key: copySourceKey,
			};

			const copyCommand = new CopyObjectCommand(copyParams);
			const deleteCommand = new DeleteObjectCommand(deleteParams);

			// Выполняем операции копирования и удаления атомарно
			await Promise.all([
				s3Client.send(copyCommand),
				s3Client.send(deleteCommand),
			]);

			// Если удаление успешно, то операция завершена успешно
			return;
		} catch (error) {
			if (error.name === "NoSuchBucket") {
				throw new BadGatewayException("Bucket does not exist");
			} else {
				console.error("Error while moving file:", error);
				throw new BadGatewayException("Something went wrong");
			}
		}
	}

	async deleteFile(key: string) {
		try {
			const deleteObjectParams = {
				Bucket: this.AWSBucket,
				Key: key,
			};
			const command = new DeleteObjectCommand(deleteObjectParams);
			return await s3Client.send(command);
		} catch (e) {
			console.log(e);
			return new Error(e);
		}
	}

	async deleteFolder(fullPath: string) {
		try {
			const listObjectsCommand = new ListObjectsV2Command({
				Bucket: process.env.AWS_BUCKET_NAME,
				Prefix: fullPath,
			});
			const { Contents, CommonPrefixes } = await s3Client.send(
				listObjectsCommand,
			);
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
		} catch (e) {
			console.error(e);
			throw new HttpException(
				{
					reason: 'Something went wrong while deleting folder',
					error: e,
				},
				HttpStatus.BAD_GATEWAY,
			);
		}
	}
}
