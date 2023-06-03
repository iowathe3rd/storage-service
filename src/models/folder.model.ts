import { Injectable } from '@nestjs/common';
import { Folder } from '@prisma/client';
import { db } from '../libs/prisma';

@Injectable()
export class FolderModel {
	async getFolderById(id: string): Promise<Folder> {
		return await db.folder.findUnique({
			where: {
				id: id
			}
		}).catch(e=> {
			throw new Error("Folder not found");
		})
	}
}