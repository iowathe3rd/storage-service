import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Post,
	Put,
	Res,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getUser() {
		return this.userService.getUser();
	}

	@Post('create')
	createUser(
		@Res() response: Response,
		@Body() createUserDto: CreateUserDto,
	) {
		const data = this.userService.createUser(createUserDto);
		return response.status(HttpStatus.OK).json({ message: { data } });
	}

	@Delete('delete')
	deleteUser() {
		return this.userService.deleteUser();
	}

	@Put('update')
	updateUser() {
		return this.userService.updateUser();
	}
}
