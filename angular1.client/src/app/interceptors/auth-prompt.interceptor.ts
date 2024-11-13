import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthPromptInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verifica si la URL contiene la base de autenticación de Google, sin importar los parámetros adicionales
    if (req.url.includes('https://accounts.google.com/o/oauth2/v2/auth')) {
      // Añade el parámetro 'prompt=login' para forzar la reautenticación
      const modifiedParams = req.params.set('prompt', 'login');
      const authReq = req.clone({ params: modifiedParams });
      return next.handle(authReq);
    }

    // Permite pasar cualquier otra solicitud sin modificarla
    return next.handle(req);
  }
}
