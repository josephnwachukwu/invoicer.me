import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  constructor(public auth: AuthService,
              private router: Router) { }

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
    this.router.navigate(['/dashboard']);
  }

}
