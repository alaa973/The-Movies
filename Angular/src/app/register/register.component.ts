import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userName: string = "";
  password: string = ""; 
  email: string = "";
  confirmPassword: string = "";
  errorMessage:string = "";
  debugger:any;
  user:User={id: 0, userName: "", hashPassword: "", confirmPassword:"", email:""};

  constructor(private _router: Router, private _loginService: LoginService){

  }
  ngOnInit(): void {
    localStorage.removeItem('auth_token');   
    localStorage.removeItem('auth_token_expiration');
  }
  visible = false;
  confirmVisible = false;
  togglePass(){
    this.visible = !this.visible;
  }
  toggleConfirmPass(){
    this.confirmVisible = !this.confirmVisible;
  }
  clearErrorMessage(){
    this.errorMessage = "";
  }
  onSubmit(){
    
    let observer = {next:(token:object)=>{
      
      this._loginService.setToken(token);
      this._router.navigate(['home']);
    },
    error:(err:any) => {
      console.log("hi "+err.error);
      this.errorMessage = err.error;

    }
  }
    this._loginService.addUser(this.user).subscribe(
      observer
      );
  }

}
