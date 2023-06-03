import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from '../../libs/prisma';
import { S3Service } from '../s3.service';


import { badRequest } from '../../utils/badRequest';

import { FolderModel } from '../../models/folder.model';
import { UpdateFileDto, UploadFileDto } from '../../dto/file.dto';


@Injectable()
export class FileService {
	constructor(private readonly s3Service: S3Service, private readonly folderModel: FolderModel) {}

	async upload(
		createFileDto: UploadFileDto,
		file: Express.Multer.File,
		userId: string,
	) {
		try {
			const folderCandidate = await this.folderModel.getFolderById(createFileDto.folderId).catch(e=> {
				throw new HttpException({reason: e}, HttpStatus.BAD_GATEWAY);
			})
			const fileCandidate = await db.file.findUnique({
				where: {
					fullPath: folderCandidate.fullPath + file.originalname
				}
			}).catch(e=> {
				throw new HttpException({reason: e}, HttpStatus.BAD_REQUEST);
			})
			let fileName: string = "";
			if(fileCandidate){
				fileName = await this.checkAndRenameFileInFolder(file.originalname, folderCandidate.fullPath);
			}
			const lastDotIndex = file.originalname.lastIndexOf(".");
			const filenameWithoutExtension = file.originalname.substring(0, lastDotIndex);
			const fileFullPath = folderCandidate.fullPath + fileName;
			const { key: s3Key } = await this.s3Service.uploadFile(file, fileFullPath).catch(e=>{
				throw new HttpException({reason: "Something went wrong while uploading", error: e}, HttpStatus.BAD_GATEWAY);
			});
			return await db.file.create({
				data: {
					userId: userId,
					folderId: createFileDto.folderId,
					extension: file.mimetype,
					name: filenameWithoutExtension,
					sizeInBytes: file.size,
					fullPath: fileFullPath,
					fullName: file.originalname,
					s3Key: s3Key
				}
			}).catch(e => {
				throw new HttpException({
					reason: "Something went wrong while uploading",
					error: e
				}, HttpStatus.BAD_GATEWAY);
			})
		} catch (e) {
			console.log(e);
			throw new HttpException({ err: e }, HttpStatus.BAD_GATEWAY);
		}
	}

	async findOne(id: string) {
		try {
			const file = await db.file.findUnique({
				where: {
					id: id
				}
			})
			if(!file){
				return badRequest<string>("REQUESTED FILE NOT FOUND", HttpStatus.BAD_REQUEST);
			}
			return file;
		}catch (e) {
			console.log(e);
			return badRequest<string>(e, HttpStatus.BAD_REQUEST);
		}
	}

	async update(id: string, updateFileDto: UpdateFileDto) {
		try {
			const fileToUpdate = await db.file.findUnique({
				where: {
					id: id
				},
			})
			if(!fileToUpdate){
				return badRequest<string>("FILE TO UPDATE NOT FOUND", HttpStatus.BAD_REQUEST);
			}
			return await db.file.update({
				where: {
					id: id
				},
				data: {
					originalName: updateFileDto.originalName,
					folderId: updateFileDto.folderId
				}
			})
		} catch (e) {
			console.log(e);
			return badRequest<string>(e, HttpStatus.BAD_REQUEST);
		}
	}
	async delete(id: string) {
		try {
			const fileCandidate = await db.file.findUnique({
				where: {
					id: id
				}
			})
			if(!fileCandidate) {
				return badRequest<string>("FILE TO UPDATE NOT FOUND", HttpStatus.BAD_REQUEST);
			}
			const deleted = await db.file.delete({
				where: {
					id: id
				}
			})
			await this.s3Service.deleteFile(deleted.key)
			return deleted;
		}catch (e) {
			console.log(e);
			return badRequest<string>(e, HttpStatus.BAD_REQUEST);
		}
	}
	async checkAndRenameFileInFolder(filename: string, folderFullPath: string) {
		let newName = filename;
		let counter = 1;
		let fileExists = true;


		while (fileExists) {
			const existingFile = await db.file.findUnique({
				where: {
					fullPath: folderFullPath + newName
				}
			})

			if (existingFile) {
				counter++;
				const fileExtension = existingFile.extension;
				newName = `${filename}_${counter}.${fileExtension}`;
			} else {
				fileExists = false;
			}
		}

		return newName;
	}
}
