import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private location: LocationStrategy, private loginService: LoginService
    ){}

  ngOnInit(): void {
    this.loginService.tokenExpired();
  }

}
