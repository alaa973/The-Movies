import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoignComponent} from './login/login.component'
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { loginGuard } from './login.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestPassResetComponent } from './request-pass-reset/request-pass-reset.component';

const routes: Routes = [
{ path: '', component: HomeComponent, pathMatch: 'full', canActivate: [authGuard] },
{ path: 'login', component: LoignComponent, canActivate:[loginGuard] },
{ path: 'register', component: RegisterComponent, canActivate:[loginGuard]},
{ path: 'home', component: HomeComponent, canActivate: [authGuard]},
{path:'edit/profile', component:EditProfileComponent, canActivate: [authGuard]},
{path:'reset', component:ResetPasswordComponent},
{path:'request/reset', component:RequestPassResetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
  
 }
