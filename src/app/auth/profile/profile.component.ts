import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

  constructor(public auth: AuthService) { }

  logout() {
    this.auth.signOut();
  }
  updateUser(user) {
  	this.auth.updateUser(user)
  }
}
