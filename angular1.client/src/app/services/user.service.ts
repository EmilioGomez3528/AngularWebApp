import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7158/api/User'; 

  constructor(private http: HttpClient) {}

  //metodo de logueo 
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };  
    return this.http.post(`${this.apiUrl}/login`, loginData); 
  }
}
