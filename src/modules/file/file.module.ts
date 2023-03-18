import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileController } from './controllers/file.controller';
import { FileService } from './services/file.service';
import { S3Service } from './services/s3.service';
import { AuthMiddleware } from '../../middleware/auth.middleware';

@Module({
	controllers: [FileController],
	providers: [FileService, S3Service],
})
export class FileModule implements NestModule{
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(FileController)
	}
}
