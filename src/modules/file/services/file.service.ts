import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../../libs/prisma';
import { S3Service } from '../../../services/s3.service';
import { FolderModel } from '../../../models/folder.model';
import { UpdateFileDto } from '../dto/file.dto';
import { splitFileName } from '../../../utils/getFileName';
import { encodeUrlWithPlus } from '../../../utils/encodeURIWithPlus';

@Injectable()
export class FileService {
	constructor(
		private readonly s3Service: S3Service,
		private readonly folderModel: FolderModel,
	) {}

	async upload(
		folderId: string,
		file: Express.Multer.File,
		userId: string,
	) {
		console.info("SERVICE STARTED");
		console.log(file);
		try {
			const {extension: fileExtension, fileNameWithoutExtension } = splitFileName(file.originalname);
			// Проверяем наличие папки
			const folder = await db.folder.findUnique({
				where: {
					id: folderId,
				},
			});

			console.log(folder);
			if (!folder) {
				return new NotFoundException('Folder not found');
			}

			// Проверяем наличие файла
			const fileCandidate = await db.file.findUnique({
				where: {
					fullPath: `${folder.fullPath}${file.originalname}`,
				},
			});
			let fileName: string;
			if (fileCandidate) {
				// Переименовываем файл, если он уже существует
				fileName = await this.checkAndRenameFileInFolder(
					{ filenameWithoutExtension: fileNameWithoutExtension, extension: fileExtension },
					folder.fullPath,
				);
			}else {
				fileName = file.originalname
			}

			const fileFullPath = `${folder.fullPath}${fileName}`;
			console.log(`File full PATH: ${fileFullPath}`);

			const { key: s3Key } = await this.s3Service.uploadFile(file, fileFullPath).catch((e) => {
				throw new HttpException(
					{
						reason: 'Something went wrong while uploading',
						error: e,
					},
					HttpStatus.BAD_GATEWAY,
				);
			});

			console.info('SERVICE DONE');
			const data = {
				user: {
					connect: {
						userId: userId
					}
				},
				folder: {
					connect: {
						id: folderId
					}
				},
				fullPath: fileFullPath,
				fullName: file.originalname,
				s3Key: s3Key,
				extension: file.originalname.split(".").pop(),
				name: fileNameWithoutExtension,
				sizeInBytes: file.size,
			}
			return await db.file
				.create({
					data: data
				})
				.catch((e) => {
					throw new HttpException(
						{
							reason: 'Something went wrong while uploading',
							error: e,
						},
						HttpStatus.BAD_GATEWAY,
					);
				});
		} catch (e) {
			console.log(e);
			throw new HttpException({ err: e }, HttpStatus.BAD_GATEWAY);
		}
	}

	async findOne(id: string) {
		try {
			const file = await db.file.findUnique({
				where: {
					id: id,
				},
			});
			if (!file) {
				return new HttpException({reason: "Requested file not found"}, HttpStatus.BAD_REQUEST);
			}
			return file;
		} catch (e) {
			console.log(e);
			throw new HttpException({ err: e }, HttpStatus.BAD_GATEWAY);
		}
	}

	async update(id: string, updateFileDto: UpdateFileDto) {
		try {
			return await db.$transaction(async (prisma) => {
				const fileToUpdate = await prisma.file.findUnique({
					where: {
						id: id,
					},
					include: {
						folder: true
					}
				});

				if (!fileToUpdate) {
					throw new NotFoundException("Requested file not found");
				}

				const targetFolder = await prisma.folder.findUnique({
					where: {
						id: updateFileDto.targetFolderId,
					},
				});

				if (!targetFolder) {
					throw new NotFoundException("Target folder not found");
				}
				const newFullPath = targetFolder.fullPath + updateFileDto.newFileName + "." +  fileToUpdate.extension
				console.log("_________");
				console.error(fileToUpdate.s3Key);
				console.error(newFullPath);
				console.log("_________");

				await this.s3Service.moveFile(
					encodeUrlWithPlus(fileToUpdate.s3Key),
					encodeUrlWithPlus(newFullPath)
				);

				return prisma.file.update({
					where: {
						id: fileToUpdate.id,
					},
					data: {
						fullPath: newFullPath,
						folder: {
							connect: {
								id: updateFileDto.targetFolderId,
							},
						},
						s3Key: newFullPath,
						name: updateFileDto.newFileName,
						fullName: `${updateFileDto.newFileName}.${fileToUpdate.extension}`,
					},
				});
			});
		} catch (error) {
			console.error("Error while updating file:", error);
			throw new HttpException({ reason: error.message }, HttpStatus.BAD_REQUEST);
		}
	}
	async delete(id: string) {
		try {
			const fileCandidate = await db.file.findUnique({
				where: {
					id: id,
				},
			});
			if (!fileCandidate) {
				return new HttpException({reason: "Requested file not found"}, HttpStatus.BAD_REQUEST);
			}
			const deleted = await db.file.delete({
				where: {
					id: id,
				},
			});
			await this.s3Service.deleteFile(deleted.s3Key);
			return deleted;
		} catch (e) {
			console.log(e);
			return new HttpException({reason: "Something went wrong while deleting file"}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkAndRenameFileInFolder({ filenameWithoutExtension, extension }: { filenameWithoutExtension: string, extension: string }, folderFullPath: string) {
		let newName = `${filenameWithoutExtension}.${extension}`;
		let counter = 1;
		let fileExists = true;

		while (fileExists) {
			console.log(newName, filenameWithoutExtension, extension);
			const existingFile = await db.file.findUnique({
				where: {
					fullPath: folderFullPath + newName,
				},
			});

			if (existingFile) {
				counter++;
				newName = `${filenameWithoutExtension}_${counter}.${extension}`;
			} else {
				fileExists = false;
			}
		}

		if (newName.endsWith(".")) {
			newName = newName.substring(0, newName.length - 1);
		}

		return newName;
	}
}
