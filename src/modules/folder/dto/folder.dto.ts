import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDTO {
	@IsString()
	@ApiProperty()
	name: string;

	@IsUUID()
	@ApiProperty()
	parentFolderId: string;
}

export class UpdateFolderDto {
	@IsString()
	@ApiProperty()
	id: string;

	@IsString()
	@ApiProperty()
	name: string;

	@IsUUID()
	@ApiProperty()
	parentFolderId: string;
}
