import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoignComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { MovieComponent } from './movie/movie.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialogModule} from '@angular/material/dialog';
import { ToastModule } from 'primeng/toast'; // Import ToastModule from PrimeNG
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { RibbonBarComponent } from './ribbon-bar/ribbon-bar.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ViewEditMovieComponent } from './view-edit-movie/view-edit-movie.component';
import { DatePipe } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { PasswordModule } from 'primeng/password';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestPassResetComponent } from './request-pass-reset/request-pass-reset.component';

@NgModule({
  declarations: [
    AppComponent,
    LoignComponent,
    RegisterComponent,
    HomeComponent,
    MovieComponent,
    MovieDetailsComponent,
    RibbonBarComponent,
    EditProfileComponent,
    ViewEditMovieComponent,
    ResetPasswordComponent,
    RequestPassResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatGridListModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ToastModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    CalendarModule,
    ChipsModule,
    MenubarModule,
    DatePipe,
    TabMenuModule,
    PasswordModule, 
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorInterceptor,
    multi: true,
  },{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS } ,ConfirmationService, MessageService, DialogService, DatePipe, JwtHelperService, ],
  bootstrap: [AppComponent],
})
export class AppModule { }
