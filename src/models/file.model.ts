import { Injectable } from '@nestjs/common';
import { File } from '@prisma/client';
import { db } from '../libs/prisma';

@Injectable()
export class FileModel {
	async getFileById(id: string): Promise<File>{
		return await db.file.findUnique({
			where: {
				id: id
			}
		}).catch(e=> {
			throw new Error("File not found");
		})
	}
	async getFileByAwsKey(key: string): Promise<File>{
		return await db.file.findUnique({
			where: {
				s3Key: key
			}
		}).catch(e=>{
			throw new Error("File not found")
		})
	}
}