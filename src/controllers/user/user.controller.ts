import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Req,
	Res,
} from '@nestjs/common';

import { UserService } from '../../services/user/user.service';
import { Request, Response } from 'express';
import { CreateUserDto } from '../../dto/user.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Post('init')
	async initUser(@Req() req: Request, @Res() res: Response, @Body() userDto: CreateUserDto): Promise<any>{
		const data= await this.userService.initUser(userDto);
		return res.status(HttpStatus.OK).json(data)
	}
}
