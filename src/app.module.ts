import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './modules/file/file.module';
import { FolderModule } from './modules/folder/folder.module';
import { UserModule } from './modules/user/user.module';
import { authMiddleware } from './middleware/auth.middleware';
import { UserController } from './controllers/user/user.controller';
import { ConfigModule } from '@nestjs/config';
import { AdminApiModule } from './modules/admin-api/admin-api.module';
import { AdminApiModule } from './modules/admin-api/admin-api.module';

@Module({
	imports: [UserModule, FolderModule, FileModule,
		ConfigModule.forRoot({
			envFilePath: ".env",
			isGlobal: true
		}),
		AdminApiModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(authMiddleware)
			.exclude({ path: 'user/init', method: RequestMethod.POST })
			.forRoutes(UserController);
	}
}
