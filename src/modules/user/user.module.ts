import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { UserController } from '../../controllers/user/user.controller';
import { UserService } from '../../services/user/user.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { UserModel } from '../../models/user.model';

@Module({
	controllers: [UserController],
	providers: [UserService, UserModel],
})
export class UserModule {}