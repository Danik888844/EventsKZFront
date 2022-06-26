import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EVENT_API_URL } from '../app-injection-tokens';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/User';
import { ACCESS_TOKEN_KEY } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, 
    @Inject(EVENT_API_URL) private apiUrl: string,
    private jwtHelper: JwtHelperService) { }

  private baseApiUrl = `${this.apiUrl}api/`;

  public getUser(): User{
    return JSON.parse(localStorage.getItem("user"));
  }

  public getUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.baseApiUrl}users`);
  }

  public getUserById(id: string): Observable<User>{
    return this.http.get<User>(`${this.baseApiUrl}users/${id}`);
  }

  public setUser(): any{
    var token = localStorage.getItem(ACCESS_TOKEN_KEY);

    var userId = this.jwtHelper.decodeToken(token)['sub'];
    this.http.get<User>(`${this.baseApiUrl}users/` + userId).subscribe((res) => {
      localStorage.setItem("user",JSON.stringify(res));
    });
  }

  public setUserRole(id:string,roles: number[]){
    
    return this.http.put(`${this.baseApiUrl}users/set_user_role/${id}`, roles);
  }

  public updateUser(id:string,firstname: string, middlename: string,lastname: string, age: number, gender: number, email: string, password: string, roles: number[]){
    return this.http.put(`${this.baseApiUrl}users/${id}`, {
      id,firstname, middlename, lastname, age, gender, email, password, roles
    });
  }

  public deleteUser(id: string){
    return this.http.delete(`${this.baseApiUrl}users/${id}`);
  }
}
