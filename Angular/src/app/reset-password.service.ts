import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import { Observable } from 'rxjs';
import { ResetPassword } from './reset-password';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) { 
  }
  sendResetEmail(email:string){
    return this.http.post<boolean>(this.apiUrl + 'users/send-reset-email/' + email,{});
  }
  resetPassword(resetDTO:ResetPassword){
    return this.http.post(this.apiUrl+"users/reset-password", resetDTO);
  }
}
