import { Injectable } from '@nestjs/common';
import {
	CreateUserDto,
	StorageLevels,
} from '../modules/admin-api/dto/user.dto';
import { db } from '../libs/prisma';
import { User } from '@prisma/client';

@Injectable()
export class UserModel {
	async initUser(dto: CreateUserDto): Promise<User> {
		return db.user.create({
			data: {
				userId: dto.id,
				storageLevel: StorageLevels[dto.storageLevel],
				folders: {
					create: {
						name: '__init',
						fullPath: `${dto.id}/`,
					},
				},
			},
		});
	}
}
