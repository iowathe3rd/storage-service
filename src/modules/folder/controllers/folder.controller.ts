import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthedRequest } from '../../../middleware/auth.middleware';

import { CreateFolderDTO, UpdateFolderDto } from '../dto/folder.dto';
import { FolderService } from '../services/folder.service';

@Controller('folder')
export class FolderController {
	constructor(private readonly folderService: FolderService) {}

	@Post('create')
	async createFolder(
		@Res() res: Response,
		@Req() req: AuthedRequest,
		@Body() dto: CreateFolderDTO,
	): Promise<Response> {
		const { user } = req;
		const data = await this.folderService.create(dto, user.id);
		return res.status(HttpStatus.OK).json({ data: data });
	}

	@Get(':id')
	async getFolder(
		@Res() res: Response,
		@Param('id') id: string,
	): Promise<Response> {
		const data = await this.folderService.getFolder(id);
		return res.status(HttpStatus.OK).json({ data: data });
	}

	@Patch(':id')
	async updateFolder(
		@Res() res: Response,
		@Param('id') id: string,
		@Body() dto: UpdateFolderDto,
	): Promise<Response> {
		const data = await this.folderService.updateFolder(dto, id);
		return res.status(HttpStatus.OK).json({ data: data });
	}

	@Delete(':id')
	async deleteFolder(
		@Res() res: Response,
		@Param('id') id: string,
	): Promise<Response> {
		const deleted = await this.folderService.deleteFolder(id);
		return res.status(HttpStatus.OK).json({ data: deleted });
	}
}
