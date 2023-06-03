import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';

@Controller('admin-api')
export class AdminApiController {
	constructor(private readonly userService: UserService) {}
	@Post('user-init')
	async initUser(
		@Req() req: Request,
		@Res() res: Response,
		@Body() userDto: CreateUserDto,
	): Promise<any> {
		const data = await this.userService.initUser(userDto);
		return res.status(HttpStatus.OK).json(data);
	}
}
