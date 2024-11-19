import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }

  //Metodo que demuestra que el usuario se encuentra autenticado mediante su userId
  isLoggedIn(): boolean {
    const user = this.getUser();
    if (user) {
      return user.userId !== null;
    }
      return false
  }
  //Metodo para saber si el usuario se encuentra autenticado almacenando la informacion en sessionstorage
  setLoginStatus(user: any): void {
    user = JSON.stringify(user);
    sessionStorage.setItem('userId', user);
  }
  //Metodo que permite la obtencion de los datos del usuario del sessionstorage
  getUser(): any | null {
    var _user = sessionStorage.getItem('userId') || "" ;
    return JSON.parse(_user);
  }

}
