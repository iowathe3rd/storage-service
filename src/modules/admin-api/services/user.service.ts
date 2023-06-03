import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateUserDto } from '../dto/user.dto';
import { UserModel } from '../../../models/user.model';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
	constructor(private readonly userModel: UserModel) {}
	async initUser(data: CreateUserDto): Promise<User | HttpException> {
		try {
			return await this.userModel.initUser(data);
		} catch (e) {
			console.log(e);
			throw new HttpException(
				{ data: null, error: e },
				HttpStatus.BAD_GATEWAY,
			);
		}
	}
}
