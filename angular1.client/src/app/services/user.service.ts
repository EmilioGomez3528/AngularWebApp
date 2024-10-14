import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetails } from '../models/user-details.model';
import { Organizations } from '../models/organizations.model';



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

  //metodo de roles y organizaciones
  getUserRolesAndOrganizations(userId: number): Observable<any> {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/GetRO`, { userId }); 
  }
  //metodo de organizaciones para el select
  getOrganizations(): Observable<any> {
    return this.http.get<Organizations[]>(`${this.apiUrl}/GetOrganizations`);
  }
  //metodo de obtencion de usuarios por organizacion
  getUsersByOrganization(organizationId: number): Observable<any> {
    return this.http.post<Organizations[]>(`${this.apiUrl}/GetUsersByOrganization`,{ organizationId });
  }
  //metodo de usuarios sin organizacion(huerfanos)
  getWithoutOrganization(): Observable<UserDetails[]> {
    return this.http.get<UserDetails[]>(`${this.apiUrl}/GetOrphanUsers`);
  }

  //metodo para agregar usuario huerfano a una organizacion
  addOrphanUserToOrg(userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddOrphanUser`, { userId });
  }
}
