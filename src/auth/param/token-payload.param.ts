import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_TOKE_PAYLOAD_NAME } from '../common/auht.constants';
import { Request } from 'express';

export const TokenPayLoadParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp()
    const request: Request = context.getRequest()

    return request[REQUEST_TOKE_PAYLOAD_NAME]
  }
)