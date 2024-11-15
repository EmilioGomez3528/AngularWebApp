import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  login(username: string, password: string, IsLocal: Boolean): Observable<any> {
    const loginData = { Username:username, password, IsLocal };
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  //metodo para obtener los detalles de usuarios en orphan user y userdetails
  getDetails(userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<UserDetails[]>(`${this.apiUrl}/GetUsers`, { params });
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
  addOrphanUserToOrg(userId: number, organizationId: number): Observable<any> {
    const userData = { userId, organizationId }
    return this.http.post<any>(`${this.apiUrl}/AddOrphanUser`, userData);
  }

  //metodo para login con microsoft y google
  OAuth(firstName: string, lastName: string, email: string, providerUserId: string, provider: string) {
    const loginData = { firstName, lastName, email, providerUserId, provider };
    return this.http.post<any>(`${this.apiUrl}/OAuth`, loginData);
  }

  updateProfileUser(userId: number, firstName: string, lastName: string, email: string, username: string) {
    const profileData = {userId, firstName, lastName, email, username};
    return this.http.post<any>(`${this.apiUrl}/UpdateProfile`,profileData);
  }
}
