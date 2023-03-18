import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';
import { Request } from 'express';
import { db } from '../../../libs/prisma';

@Injectable()
export class FileService {
	constructor(private readonly s3: S3Service) {
	}
	async upload(file: Express.Multer.File, req: Request, path: string, userId: string): Promise<any> {
		try {
			path = `${userId}/${path}`;
			const uploaded = await this.s3.uploadFile(file, path);
			if(!uploaded){
				throw new HttpException({message: "Something went wrong while deleting file"},HttpStatus.BAD_GATEWAY);
			}
			const data = await db.files.create({
				data: {
					key: `${path}/${file.originalname}`,
					originalName: file.originalname,
					extension: file.mimetype,
					size: file.size,
					ownerId: userId
				}
			})
			if(!data) throw new HttpException({message: "Something went wrong while creating file"}, HttpStatus.BAD_GATEWAY);
			return data;
		} catch (err) {
			console.error('Error', err);
			throw new HttpException({message: "Something went wrong"}, HttpStatus.BAD_GATEWAY);
		}
	}

	async delete(key: string) {
		try {
			const data = await this.s3.delete(key);
			return data;
		} catch (e) {
			console.log('Error', e);
		}
	}
}
