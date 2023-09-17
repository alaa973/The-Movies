import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { User } from '../user';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoignComponent implements OnInit {
user:User={id: 0, userName: "", hashPassword: "", confirmPassword:"", email:""};
 constructor(private _router: Router, private _loginService: LoginService, private route: ActivatedRoute
  ){

 }
  ngOnInit(): void {
    localStorage.removeItem('auth_token');   
    localStorage.removeItem('auth_token_expiration');
  }
  //onSubmit(){
   //some validations
   //localStorage.setItem('token', Math.random().toString());
   //this._router.navigate(['home'])
  //}
  errorMessage = "";
  visible = false;
  clearErrorMessage() {
    this.errorMessage = '';
  }
  togglePass(){
    this.visible = !this.visible;
  }
  onSubmit(){
    let observer = {next:(token:object)=>{
      
      this._loginService.setToken(token);
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this._router.navigateByUrl(returnUrl);
      //this._router.navigate(['home']);
      this.errorMessage = "";
    },
    error:(err:any) => {
      console.log(err.error);
      this.errorMessage = 'Invalid credentials. Please provide the correct username and password.';

    }
  }
    this._loginService.validateUser(this.user).subscribe(
      observer
      );
  }
}
