import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	id: string;

	@IsEmail()
	email: string;
}

export class DeleteUserDto {
	@IsNotEmpty()
	@IsString()
	id: string;

	@IsEmail()
	email: string;
}

export class UpdateUserDto {
	@IsNotEmpty()
	@IsString()
	id: string;

	@IsEmail()
	email: string;
}
