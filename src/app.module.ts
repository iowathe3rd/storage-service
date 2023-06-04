import { MiddlewareConsumer, Module, NestModule, RequestMethod, VERSION_NEUTRAL } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './modules/file/file.module';
import { FolderModule } from './modules/folder/folder.module';

import { ConfigModule } from '@nestjs/config';
import { AdminApiModule } from './modules/admin-api/admin-api.module';
import { LoggerModule } from 'nestjs-pino';
import { Auth2Middleware } from './middleware/auth2.middleware';
import { FileController } from './modules/file/controllers/file.controller';
import { FolderController } from './modules/folder/controllers/folder.controller';

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
			.apply(Auth2Middleware)
			.exclude("admin")
			.forRoutes(FileController, FolderController)
	}
}
