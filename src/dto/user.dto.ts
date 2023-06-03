import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StorageLevels {
	Free = 'Free',
	Pro = 'Pro',
	Enterprise = 'Enterprise',
}

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	id: string;

	@IsEnum(StorageLevels)
	@ApiProperty()
	storageLevel: StorageLevels;
}

export class UpdateUserDto {
	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	id: string;

	@IsEnum(StorageLevels)
	@ApiProperty()
	storageLevel: StorageLevels;
}

export class DeleteUserDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	id: string;
}
