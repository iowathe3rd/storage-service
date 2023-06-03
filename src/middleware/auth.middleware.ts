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
		const {user} = await authenticate(req.headers.authorization.split(' ')[1]).catch(e=>{
			throw new ForbiddenException({reason: "Please register or sign in"})
		});
		req.user = user;
	}catch (e) {
		console.log(e);
		throw new ForbiddenException({reason: "Please register or sign in"})
	}
	next();
}

export interface AuthedRequest extends Request {
	user: User;
}
