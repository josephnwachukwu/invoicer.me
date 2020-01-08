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

 //  	const httpOptions = {
	//     responseType: 'blob' as 'json'
	// };

  const currentRoute: string = this.route.url

  console.log('cr', currentRoute)

   if (window.location.href.indexOf("view/") > -1) {
      this.isViewOnly = true
    }
    console.log('ivo', this.isViewOnly)
  	// this.http.get('https://us-central1-invoicer-6022f.cloudfunctions.net/api/screenshot?url=https://invoicer-6022f.firebaseapp.com/view/vSAliUh9zaVuVJML4yG5', httpOptions).subscribe((data:Blob) => {
   //    const file = new Blob([data], { type: 'application/pdf' });
   //    const downloadURL = URL.createObjectURL(file);
   //    window.open(downloadURL);
   //  });

  }

  ngOnInit() {
  }

  logout() {
    this.auth.signOut();
  }

}
