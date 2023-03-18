import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
import { db } from '../../../libs/prisma';

@Injectable()
export class UserService {
	async createUser(data: CreateUserDto): Promise<CreateUserDto> {
		try {
			const created = await db.owner.create({
				data: {
					id: data.id,
					email: data.email,
				},
			});
			return created;
		} catch (e) {
			console.log(e);
			throw new HttpException(
				{ reason: 'internal server error' },
				HttpStatus.BAD_GATEWAY,
			);
		}
	}

	async deleteUser() {}

	async updateUser() {}

	async getUser() {}
}
