import { Injectable } from '@nestjs/common';
import { authClient } from '../libs/authClient';
import { UserService } from './user/user.service';
import { StorageLevels } from '../dto/user.dto';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {
	}
}