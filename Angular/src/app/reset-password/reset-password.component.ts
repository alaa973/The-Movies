import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from '../reset-password';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ResetPasswordService } from '../reset-password.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{
  constructor(private route:ActivatedRoute, private messageService: MessageService,
    private resetService: ResetPasswordService, private router: Router){}
  matchError = "Passwords don't match.";
  resetPasswordObj = new ResetPassword();
  ngOnInit(): void {
    this.route.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      this.emailToken = val['code'].replace(/ /g, '+');
      console.log(this.emailToReset);
      console.log(this.emailToken);
    })
  }
  emailToReset = "";
  emailToken = "";
  password: string = ""; 
  confirmPassword: string = "";
  errorMessage:string = "";
  visible = false;
  confirmVisible = false;
  togglePass(){
    this.visible = !this.visible;
  }
  toggleConfirmPass(){
    this.confirmVisible = !this.confirmVisible;
  }
  onSubmit(){
    debugger;
    this.resetPasswordObj.email = this.emailToReset;
    this.resetPasswordObj.newPassword = this.password;
    this.resetPasswordObj.confirmPassword = this.confirmPassword;
    this.resetPasswordObj.emailToken = this.emailToken;
    let observer = {next:(data:any)=>{
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset successfully!' });  
      this.router.navigate(['/']);
    },
    error:(err:any) => {
        this.errorMessage = err.error.message;
    }
  }
    this.resetService.resetPassword(this.resetPasswordObj).subscribe(observer);
   
  }
}
