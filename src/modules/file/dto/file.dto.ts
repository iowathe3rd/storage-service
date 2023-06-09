import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
	@IsUUID()
	@ApiProperty()
	folderId: string;
}

export class UpdateFileDto {
	@IsUUID()
	@ApiProperty()
	targetFolderId: string;

	@IsString()
	@ApiProperty()
	newFileName: string
}
