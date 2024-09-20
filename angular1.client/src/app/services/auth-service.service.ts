import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }

  
  isLoggedIn(): boolean {
    const userId = sessionStorage.getItem('userId');
    return userId !== null; 
  }

  
  setLoginStatus(userId: string): void {
    sessionStorage.setItem('userId', userId); 
  }

  
  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }
}
