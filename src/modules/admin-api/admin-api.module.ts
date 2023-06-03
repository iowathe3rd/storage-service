import { Module } from '@nestjs/common';
import { AdminApiService } from './services/admin-api.service';
import { AdminApiController } from './controllers/admin-api.controller';
import { UserService } from './services/user.service';
import { UserModel } from '../../models/user.model';

@Module({
	controllers: [AdminApiController],
	providers: [AdminApiService, UserService, UserModel],
})
export class AdminApiModule {}
