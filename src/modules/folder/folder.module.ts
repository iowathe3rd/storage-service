import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { FolderController } from '../../controllers/folder/folder.controller';
import { FolderService } from '../../services/folder/folder.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { S3Service } from '../../services/s3.service';

@Module({
	controllers: [FolderController],
	providers: [FolderService, S3Service],
})
export class FolderModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(authMiddleware)
			.forRoutes(FolderController);
	}
}
