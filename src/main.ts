import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { validateEnv } from './utils/envValidate';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = new DocumentBuilder()
		.setTitle('File management api')
		.setDescription('Rest api for managing files stored in amazon bucket')
		.setVersion('1.0')
		.build();
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: "1"
	})
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('openapi', app, document);
	validateEnv();
	await app.listen(3000);
}
bootstrap();
