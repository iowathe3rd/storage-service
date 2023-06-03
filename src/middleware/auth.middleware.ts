import { ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../libs/authClient';
import { User } from '@supabase/gotrue-js';

export async function authMiddleware(
	req: AuthedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		console.log(req.headers.authorization.split(' ')[1]);
		const { user } = await authenticate(
			req.headers.authorization.split(' ')[1],
		);
		req.user = user;
	} catch (error) {
		console.log(error);
		throw new ForbiddenException('Please register or sign in.');
	}
	next();
}

export interface AuthedRequest extends Request {
	user: User;
}
