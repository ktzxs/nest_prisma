import { Injectable, NestMiddleware } from '@nestjs/common';
import {
    Request,
    Response,
    NextFunction
} from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const authorization =req.headers.authorization
        if (authorization) {
            if(authorization === '123456') {
                req['users'] = {
                    token: authorization
                }
                next()
            }
        }
        next()
    }
}
