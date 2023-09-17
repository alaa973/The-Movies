import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { UserService } from '../user.service';
import { User } from '../user';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MovieService } from '../movie.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-ribbon-bar',
  templateUrl: './ribbon-bar.component.html',
  styleUrls: ['./ribbon-bar.component.scss']
})
export class RibbonBarComponent implements OnInit{

  constructor(private _router:Router, private modalService: NgbModal,private confirmationService: ConfirmationService, 
    private messageService: MessageService, private UserService: UserService, private dialogService: DialogService,
    private movieService: MovieService, private loginService: LoginService){}
    active:MenuItem|undefined;
  ngOnInit(): void {
    if(this.loginService.isAdmin()){
      this.menuItems = [
        { label: 'Home', icon: 'pi pi-fw pi-home', command: () => this._router.navigate(['home'])},
        { label: 'Add Movie', icon: 'pi pi-fw pi-plus', command: () => this.show()},
        { label: 'My Account', icon: 'pi pi-fw pi-user', command: () => this._router.navigate([ 'edit/profile']) },
        { label: 'Delete Account', icon: 'pi pi-fw pi-trash',  command: () => this.confirmDelete() },
        { label: 'Logout', icon: 'pi pi-fw pi-power-off',  command: () => this.confirmLogout() },        
    ];
    }
    else{
        this.menuItems = [
          { label: 'Home', icon: 'pi pi-fw pi-home', command: () => this._router.navigate(['home'])},
          { label: 'My Account', icon: 'pi pi-fw pi-pencil', command: () => this._router.navigate([ 'edit/profile']) },
          { label: 'Delete Account', icon: 'pi pi-fw pi-trash',  command: () => this.confirmDelete() },
          { label: 'Logout', icon: 'pi pi-fw pi-power-off',  command: () => this.confirmLogout() },          
      ];
      
    }
  if(this._router.url == '/home' || this._router.url == '/')
     this.active = this.menuItems[0];
  if(this._router.url == '/edit/profile'){
    if(this.loginService.isAdmin())
      this.active = this.menuItems[2];
    else
       this.active = this.menuItems[1];


  }
  }
  ref: DynamicDialogRef | undefined;
  show() {
    let prev = this.active;
    debugger;
    this.active = undefined;
    this.ref  = this.dialogService.open(MovieDetailsComponent, {
        header: 'Add a movie',
        width: '50%',
        height: "80%",
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true
    });
  this.ref.onClose.subscribe(()=>{
   
     this.active = prev;
    })
  

}
onActiveItemChange(event: MenuItem) {
  //this.active = undefined;
  this.active = event;
}
activateLast() {
  this.active = (this.menuItems as MenuItem[])[(this.menuItems as MenuItem[]).length - 1];
}
ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
}
    private currentUser!: User;
    menuItems!: MenuItem[];
  onLogout(){
    this.active = this.menuItems[4];
    localStorage.removeItem('auth_token');   
    localStorage.removeItem('auth_token_expiration');

    this._router.navigate(['login']);
  }
  confirmDelete() {
    if(this.loginService.tokenExpired()){
      return;
    }
    let prev = this.active;
    this.confirmationService.confirm({
        message: 'Are you sure you want to Delete your account?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
            this.UserService.getCurrUser().subscribe(user => {
              this.currentUser = user;
              this.UserService.deleteAcc(this.currentUser.id).subscribe(()=>{
                this.onLogout();
              })
            
            
            });
             
          },
          reject:() =>{
            this.active = prev;
          }
    });
}
confirmLogout() {
  this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'logout Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
         
          this.onLogout();
        },
      reject:() =>{
        this.active = this.menuItems[0];
      }
  });
}
}
