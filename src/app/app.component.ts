import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent implements OnInit {
  isViewOnly:boolean = false
  constructor(public auth: AuthService, public http: HttpClient, private route: Router) {

  const currentRoute: string = this.route.url

   if (window.location.href.indexOf("view/") > -1) {
      this.isViewOnly = true
    }

  }

  ngOnInit() {
  }

  logout() {
    this.auth.signOut();
  }

}
