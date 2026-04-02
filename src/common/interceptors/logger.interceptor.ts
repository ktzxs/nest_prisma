import { 
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable 
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        console.log('Interceptando a requisição...');
        const request = context.switchToHttp().getRequest()
        const method = request.method;
        const url = request.url;
        const now = Date.now();
        console.log(`[REQUEST] [${method}] ${url} - ${now} - inicio da requisicao`)

        return next.handle().pipe(
            tap(() => {
                console.log(`[REQUEST] [${method}] ${url} - ${now} - inicio da requisicao`)
            })
        );
    }

}
