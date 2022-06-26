import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { EVENT_API_URL } from '../app-injection-tokens';
import { Token } from '../models/token';
import { UserService } from './user.service';

export const ACCESS_TOKEN_KEY = 'event_access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject(EVENT_API_URL) private apiUrl: string,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private us: UserService
  ) { }

  register(firstname: string, middlename: string,lastname: string, age: number, gender: number, email: string, password: string): any{
    return this.http.post(`${this.apiUrl}api/users/register`,{
      firstname, middlename, lastname, age, gender, email, password
    })
  }

  login(email: string, password: string): Observable<Token>{
    return this.http.post<Token>(`${this.apiUrl}api/users/login`,{
      email,password
    }).pipe(
      tap(token =>{
        localStorage.setItem(ACCESS_TOKEN_KEY, token.access_token);
        this.us.setUser();
      })
    )
  }

  isAuthenticated(): boolean{
    var token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void{
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem("user");
    this.router.navigate(['']);
  }
}
