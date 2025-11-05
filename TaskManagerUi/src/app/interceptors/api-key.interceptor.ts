import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

export const apiKeyInterceptor : HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> =>
{

const authService = inject(AuthService);
const apiKey = authService.getApiKey();

if(apiKey){
    const clonedReq = req.clone({
        setHeaders: {
            'X-API-KEY': apiKey
        }
    });
    return next(clonedReq);
}


return next(req);
};