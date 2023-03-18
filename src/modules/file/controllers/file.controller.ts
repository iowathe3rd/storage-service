import {
	Body,
	Controller,
	Delete,
	HttpStatus,
	Post,
	Query,
	Req,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';

@Controller('file')
export class FileController {

	constructor(private readonly fileService: FileService) {
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@Res() res: Response,
		@Req() req: Request,
		@UploadedFile() file: Express.Multer.File,
		@Body("path") path: string
	){
		// @ts-ignore
		const { userId } = req;
		const uploaded = await this.fileService.upload(file, req, path, userId);
		return res.status(HttpStatus.OK).json({ message: 'file uploaded', data: uploaded });
	}

	@Delete('delete')
	deleteFile(
		@Res() res: Response,
		@Query("type") type: string,
		@Body('key') key: string,
	) {
		const deleted = this.fileService.delete(key);
		return res.status(HttpStatus.OK).json({ message: 'successfully deleted' });
	}
}
