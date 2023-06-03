import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './modules/file/file.module';
import { FolderModule } from './modules/folder/folder.module';

import { ConfigModule } from '@nestjs/config';
import { AdminApiModule } from './modules/admin-api/admin-api.module';
import { authMiddleware } from './middleware/auth.middleware';
import { AdminApiController } from './modules/admin-api/controllers/admin-api.controller';

@Module({
	imports: [
		FolderModule,
		FileModule,
		AdminApiModule,
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule{
	configure(consumer: MiddlewareConsumer): any {
		consumer
			.apply(authMiddleware)
			.exclude("admin-api")
			.forRoutes("*")
	}
}
