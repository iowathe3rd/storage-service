import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { db } from '../../libs/prisma';
import { CreateUserDto, UpdateUserDto } from '../../dto/user.dto';
import { UserModel } from '../../models/user.model';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
	constructor(private readonly userModel: UserModel) {
	}
	async initUser(data: CreateUserDto): Promise<User | HttpException> {
		try {
			return await this.userModel.initUser(data);
		} catch (e) {
			console.log(e);
			throw new HttpException({ data: null, error: e }, HttpStatus.BAD_GATEWAY);
		}
	}
}
