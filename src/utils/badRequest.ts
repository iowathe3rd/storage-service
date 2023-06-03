import { HttpException, HttpStatus } from '@nestjs/common';

export function badRequest<T>(data: T, status: HttpStatus){
	return new HttpException({err: data}, status)
}
