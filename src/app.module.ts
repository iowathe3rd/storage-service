import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/user/user.module';

@Module({
	imports: [FileModule, UserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
