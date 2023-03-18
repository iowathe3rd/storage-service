import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		const bearerHeader = req.headers.authorization;
		if(!bearerHeader){
			throw new ForbiddenException('Please register or sign in.');
		}
		const accessToken = bearerHeader.split(' ')[1];
		let user;
		try {
			//TODO auth
			console.log("authed")
			user = accessToken;
		} catch (error) {
			throw new ForbiddenException('Please register or sign in.');
		}
		if (user) {
			// @ts-ignore
			req.userId = user;
		}
		console.log(req.headers);
		next();
	}
}
