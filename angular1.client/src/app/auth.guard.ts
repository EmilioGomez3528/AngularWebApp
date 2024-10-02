import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isLoggedIn();

    if (isAuthenticated) {
      return true;
    } 
      this.router.navigate(['/login']);
      return false;
  }
}
