import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }

  
  isLoggedIn(): boolean {
    const user = this.getUser();

    if (user) {
      return user.userId !== null;
    }
      return false
  }

  setLoginStatus(user: any): void {
    user = JSON.stringify(user);
    sessionStorage.setItem('userId', user);
  }

  getUser(): any | null {
    var _user = sessionStorage.getItem('userId') || "" ;
    return JSON.parse(_user);
  }
}
