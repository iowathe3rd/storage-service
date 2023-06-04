import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Res,
	HttpStatus,
	UseInterceptors,
	UploadedFile,
	Req, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthedRequest } from '../../../middleware/auth.middleware';
import { FileService } from '../services/file.service';
import { UpdateFileDto, UploadFileDto } from '../dto/file.dto';

@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async upload(
		@Req() req: AuthedRequest,
		@UploadedFile('file') file: Express.Multer.File,
		@Query("folderid") folderId: string,
		@Res() res: Response,
	): Promise<Response> {
		console.log(folderId);
		const { user } = req;
		const data = await this.fileService.upload(folderId, file, user.id);
		return res.status(HttpStatus.OK).json({ data });
	}

	@Get(':id')
	async findOne(@Res() res: Response, @Param('id') id: string) {
		const data = await this.fileService.findOne(id);
		return res.status(HttpStatus.OK).json({ data });
	}

	@Patch(':id')
	async update(
		@Res() res: Response,
		@Param('id') id: string,
		@Body() updateFileDto: UpdateFileDto,
	) {
		const data = await this.fileService.update(id, updateFileDto);
		return res.status(HttpStatus.OK).json({ data });
	}

	@Delete(':id')
	async remove(@Res() res: Response, @Param('id') id: string) {
		const data = await this.fileService.delete(id);
		return res.status(HttpStatus.OK).json({ data });
	}
}
