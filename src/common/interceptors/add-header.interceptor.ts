import { 
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable 
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class AddHeaderInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const response = context.switchToHttp().getResponse()
        response.setHeader('X-Custom-Header', 'Valor do cabecalho personalizado')

        return next.handle()
    }

}
