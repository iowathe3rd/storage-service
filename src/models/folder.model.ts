import { Injectable, NotFoundException } from '@nestjs/common';
import { Folder } from '@prisma/client';
import { db } from '../libs/prisma';

@Injectable()
export class FolderModel {
	async getFolderById(id: string): Promise<Folder> {
		const folder =  await db.folder
			.findUnique({
				where: {
					id: id,
				},
			})
		if (!folder) {
			throw new NotFoundException("Folder not Found");
		}
		return folder
	}
}
