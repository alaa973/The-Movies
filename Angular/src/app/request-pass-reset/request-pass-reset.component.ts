import { Component } from '@angular/core';
import { ResetPasswordService } from '../reset-password.service';

@Component({
  selector: 'app-request-pass-reset',
  templateUrl: './request-pass-reset.component.html',
  styleUrls: ['./request-pass-reset.component.scss']
})
export class RequestPassResetComponent {
  constructor(private resetService: ResetPasswordService){}
  email: string = "";
  errorMessage: string = "";
  sent:boolean = false;
  loading: boolean = false;

  onSubmit(){
    this.loading = true; 
    console.log(this.email)
    
    let observer = {next:(data:any)=>{
      this.sent = true;
      console.log(data);
    },
    error:(err:any) => {  
      this.loading = false;   
      this.errorMessage = err.error.message;
      console.log("error" + err.error.message);
    },
    complete: () => {
      this.loading = false; // Set loading to false when the request is complete
    }
  }
    this.resetService.sendResetEmail(this.email).subscribe(
      observer
      );
  }
}
