import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { authenticate } from '../libs/authClient';

@Injectable()
export class Auth2Middleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    try {
      const {user} = await authenticate(req.headers.authorization.split(' ')[1]).catch(e=>{
        console.log(e)
        throw new ForbiddenException({reason: "Please register or sign in"})
      });
      req.user = user;
    }catch (e) {
      console.log(e);
      throw new ForbiddenException({reason: "Please register or sign in"})
    }
    next()
  }
}
