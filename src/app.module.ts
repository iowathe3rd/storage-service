import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './modules/file/file.module';
import { FolderModule } from './modules/folder/folder.module';

import { ConfigModule } from '@nestjs/config';
import { AdminApiModule } from './modules/admin-api/admin-api.module';

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
export class AppModule {}
