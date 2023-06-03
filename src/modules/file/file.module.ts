import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { FileController } from '../../controllers/file/file.controller';
import { FileService } from '../../services/file/file.service';
import { S3Service } from '../../services/s3.service';
import { PuppeteerService } from '../../services/puppeteer.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { FolderModel } from '../../models/folder.model';
import { FileModel } from '../../models/file.model';

@Module({
	controllers: [FileController],
	providers: [FileService, S3Service, PuppeteerService, FolderModel, FileModel],
})
export class FileModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(authMiddleware)
			.forRoutes(FileController);
	}
}
