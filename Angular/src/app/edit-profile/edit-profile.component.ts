import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  userForm!: FormGroup;
  currentUser!: User;
  isEditable: boolean = false;
  editPressed: boolean = false;
  buttonCondition: string = "init";
  visible: boolean = false;
  editErrorMessage = '';
  constructor(private fb: FormBuilder, private userService: UserService,
    private messageService: MessageService, private loginService: LoginService){}
  ngOnInit(): void {
    this.loginService.tokenExpired();
    this.userForm = this.fb.group({
      password: ['', Validators.required],
      username: [''],
      email: [''],
      newPassword: [''],
      confirmPassword: [''],
    });
    this.userService.getCurrUser().subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser);
      this.userForm.patchValue({
        email:this.currentUser.email,
        username: this.currentUser.userName,
        
      })
    });
  }

  get email(){
    return this.userForm.get('email');
  }
  get username(){
    return this.userForm.get('username');
  }
  get password(){
    return this.userForm.get('password');
  }
  togglePass(){
    this.visible = !this.visible;
    console.log(this.visible)
  }
  errorMessage: string = '';
  verifyPass(){
    let observer = {next:(token:object)=>{
      this.isEditable = true;
      this.messageService.add({ severity: 'info', summary: 'Edit', detail: " Verified, you can edit your profile."});
      this.buttonCondition = 'verified';
    },
    error:(err:any) => {
      this.errorMessage = err.error;

    }
  }
    this.userService.verifyPassword(this.currentUser.id, this.password?.value).subscribe(
      observer
      );
    
  }
  saveChanges(){
    let observer ={
      next:(user:User) => {
        this.messageService.add({ severity: 'info', summary: 'Updated', detail: "Your profile has been updated."});
      },
      error:(err:any) => {
        console.log("hi "+err.error);
        this.editErrorMessage = "Username or email already exists.";
  
      }

    }
    this.userService.editUser(this.currentUser.id,{userName: this.username?.value,
    email: this.email?.value,
    hashPassword: this.password?.value} ).subscribe(observer
      );
  }
}
