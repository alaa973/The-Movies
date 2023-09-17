import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { User } from './user';
import {JwtHelperService} from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private  token: string  = "";
  private tokenExpiration: Date | null = null;
  jwtToken?: string;
  decodedToken?: { [key: string]: string };
  setToken(tokenData: any) {
    this.token = tokenData.token;
    this.tokenExpiration = new Date(tokenData.expiration);
    // Store the token and expiration in local storage or a session variable
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('auth_token_expiration', this.tokenExpiration.toString());
    this.jwtToken = this.token;
    console.log(this.isAdmin());
  }


  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService,
    private messageService: MessageService, private router: Router) { 
  }


  decodeToken() {
    this.decodedToken = jwt_decode(localStorage.getItem('auth_token')!);
  }
  isAdmin(){
    this.decodeToken();
    return this.decodedToken?.['role'] == 'admin';
  }
  getToken() {
    return this.token;
  }

  getTokenExpiration() {
    return this.tokenExpiration;
  }

  isAuthenticated(): boolean {
    const now = new Date();
    return !(this.token && this.tokenExpiration && this.tokenExpiration > now);
  }
  tokenExpired(){
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('auth_token'))){
      this.messageService.add({ severity: 'info', summary: 'Session expired', detail: 'Your session has expired, please login again.',
      sticky: true });
      localStorage.removeItem('auth_token');   
      localStorage.removeItem('auth_token_expiration');
      this.router.navigate(['login'])
      return true;
    }
    return false;
  }
  validateUser(user:User): Observable<object>{
    return this.http.post<object>(this.apiUrl+"users/login",user);

  }
  addUser(user:User): Observable<User>{
    return this.http.post<User>(this.apiUrl+"users/register",user);
  }
}
