import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../../libs/prisma';
import { CreateFolderDTO, UpdateFolderDto } from '../dto/folder.dto';
import { Folder, Prisma } from '@prisma/client';
import { S3Service } from '../../../services/s3.service';

@Injectable()
export class FolderService {
	constructor(private readonly s3Service: S3Service) {}
	async create(
		data: CreateFolderDTO,
		userId: string,
	): Promise<Folder | HttpException> {
		try {
			const parentFolder = await db.folder
				.findUnique({
					where: {
						id: data.parentFolderId,
					},
				})
			if(!parentFolder) throw new NotFoundException({reason: "Folder not found"});
			const folderToCreate: Prisma.FolderCreateInput = {
				name: data.name,
				parentFolder: {
					connect: {
						id: parentFolder.id,
					},
				},
				fullPath: parentFolder.fullPath + data.name,
				user: {
					connect: {
						userId: userId,
					},
				},
			};
			return await db.folder
				.create({ data: folderToCreate })
				.catch((e) => {
					throw new HttpException(
						{ reason: 'Something went wrong', error: e },
						HttpStatus.BAD_GATEWAY,
					);
				});
		} catch (e) {
			console.log(e);
			throw new HttpException({ err: e }, HttpStatus.BAD_GATEWAY);
		}
	}

	async getFolder(id: string): Promise<Folder | HttpException> {
		try {
			return await db.folder
				.findUnique({
					where: {
						id: id,
					},
					include: {
						childFolders: true,
					},
				})
				.catch((e) => {
					throw new HttpException(
						{ reason: 'Requested folder not found', error: e },
						HttpStatus.BAD_REQUEST,
					);
				});
		} catch (e) {
			console.log(e);
			throw new HttpException({reason: "Something went wrong", e: e}, HttpStatus.BAD_GATEWAY)
		}
	}

	async updateFolder(
		dto: UpdateFolderDto,
		id: string,
	): Promise<Folder | HttpException> {
		try {
			const folderToUpdate = await db.folder
				.findUnique({
					where: {
						id: id
					},
				})
			if(!folderToUpdate) throw new NotFoundException({reason: "Folder not found"})
			let data: Prisma.FolderUpdateInput = {
				name: dto.name,
				fullPath: folderToUpdate.fullPath.split("/").slice(0, -1).join("/") + "/" + dto.name,
				parentFolder: {
					connect: {
						id: dto.parentFolderId,
					},
				},
			};
			if (dto.parentFolderId === folderToUpdate.parentFolderId) {
				data = {
					name: dto.name,
					fullPath: folderToUpdate.fullPath.split("/").slice(0, -1).join("/") + "/" + dto.name,
				};
			}
			return await db.folder
				.update({
					where: {
						id,
					},
					data: data,
				})
				.catch((e) => {
					throw new HttpException(
						{ reason: 'Something went wrong', error: e },
						HttpStatus.BAD_GATEWAY,
					);
				});
		} catch (e) {
			console.log(e);
			throw new HttpException({reason: "Something went wrong", e: e}, HttpStatus.BAD_GATEWAY)
		}
	}

	async deleteFolder(id: string): Promise<object | HttpException> {
		try {
			const folderToDelete = await db.folder
				.findUnique({
					where: {
						id: id,
					},
				})
				.catch((e) => {
					throw new HttpException(
						{ reason: 'Requested folder not found', error: e },
						HttpStatus.BAD_REQUEST,
					);
				});
			await this.s3Service
				.deleteFolder(folderToDelete.fullPath)
				.catch((e) => {
					throw new HttpException(
						{
							reason: 'Something went wrong while deleting folder',
							error: e,
						},
						HttpStatus.BAD_GATEWAY,
					);
				});
			return await db.folder.delete({
				where: {
					id: id,
				},
			});
		} catch (e) {
			console.log(e);
			throw new HttpException({reason: "Something went wrong", e: e}, HttpStatus.BAD_GATEWAY)
		}
	}
}
