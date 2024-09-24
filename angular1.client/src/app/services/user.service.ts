import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetails } from '../models/user-details.model';



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

  getDetails(): Observable<UserDetails[]> {
    return this.http.get<UserDetails[]>(`${this.apiUrl}/GetUsers`);
  }
}
