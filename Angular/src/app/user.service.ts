import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Observable, Unsubscribable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }
  deleteAcc(id:number):Observable<void>{
    return this.http.delete<void>(this.apiUrl + "Users/" + id);
  }
  getCurrUser():Observable<User>{
    return this.http.get<User>(this.apiUrl + "Users/currentUser");
  }
  verifyPassword(id: number, password:any): Observable<object>{
    
    return this.http.post<object>(this.apiUrl + "users/" + id + "/verify/password", {password: password});
  }
  editUser(id: number, user: any): Observable<User>{
    console.log(user);
    return this.http.patch<User>(this.apiUrl + "users/" + id, user);
  }
}
