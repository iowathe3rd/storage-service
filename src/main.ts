import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { validateEnv } from './utils/envValidate';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ['error', 'warn', 'debug', 'log', 'verbose', ],
		bufferLogs: true
	});
	// app.useLogger(app.get(Logger));
	const config = new DocumentBuilder()
		.setTitle('File management api')
		.setDescription('Rest api for managing files stored in amazon bucket')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('openapi', app, document, {yamlDocumentUrl: "openapi-yaml"});
	validateEnv();
	await app.listen(3000);
}
bootstrap().catch((e)=>{
	console.log(e)
});
