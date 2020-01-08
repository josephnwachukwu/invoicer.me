import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../auth.service';
import { AuthConfigService } from '../shared/auth-config.service'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  constructor(public auth: AuthService,  private router: Router, public appConfig: AuthConfigService) {

  }

  /// Social Login

  signInWithGithub() {
    this.auth.githubLogin()
    .then(() => this.afterSignIn());
  }

  signInWithGoogle() {
    this.auth.googleLogin()
      .then(() => this.afterSignIn());
  }

  signInWithFacebook() {
    this.auth.facebookLogin()
      .then(() => this.afterSignIn());
  }

  signInWithTwitter() {
    this.auth.twitterLogin()
      .then(() => this.afterSignIn());
  }

  /// Anonymous Sign In

  signInAnonymously() {
    this.auth.anonymousLogin()
      .then(() => this.afterSignIn());
  }

  /// Shared

  private afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    this.router.navigate(['/dashobard']);
  }

}
