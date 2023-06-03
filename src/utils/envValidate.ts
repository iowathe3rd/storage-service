import * as joi from 'joi';

export function validateEnv(): void {
	// Определить схему для валидации переменных окружения
	console.warn('Env validating STARTED');
	const schema = joi.object({
		DATABASE_USER: joi.string().required(),
		PORT: joi.number().port().required(),
		DATABASE_PASSWORD: joi.string().required(),
		DATABASE: joi.string().required(),
		DATABASE_URL: joi.string().uri().required(),
		AWS_REGION: joi.string().required(),
		AWS_ACCESS_KEY_ID: joi.string().required(),
		AWS_SECRET_ACCESS_KEY: joi.string().required(),
		AWS_BUCKET_NAME: joi.string().required(),
		KONG_KEY: joi.string().required(),
		// Добавьте остальные переменные окружения с их схемами валидации
	});

	// Провалидировать переменные окружения
	const { error } = schema.validate(process.env, {
		abortEarly: false,
		stripUnknown: true,
	});

	// Если есть ошибки валидации, вывести их в консоль
	if (error) {
		console.error('Ошибка валидации переменных окружения:');
		error.details.forEach((err) => {
			console.error(err.message);
		});
		process.exit(1);
	}
	console.warn('Env validating STOPPED');
}
