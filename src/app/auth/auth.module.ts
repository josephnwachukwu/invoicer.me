import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Services
import { AuthService } from './auth.service';
import { NotifyService } from './shared/notifications/notify.service';
import { AuthConfigService } from './shared/auth-config.service'


// Firebase imports
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationMessageComponent } from './shared/notifications/notification-message/notification-message.component';
import { LoginFormComponent } from './forms/login/login-form.component';
import { RegisterFormComponent } from './forms/register/register-form.component';
import { AdminComponent } from './admin/admin.component';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AuthRoutingModule,
    CommonModule
  ],
  providers: [ 
    AuthService, 
     NotifyService, 
     AuthConfigService
  ],
  declarations: [
  	RegisterComponent,
  	LoginComponent,
    ProfileComponent,
    NotificationMessageComponent,
    LoginFormComponent,
    RegisterFormComponent,
    AdminComponent,
  ],
  exports: [
  	RegisterComponent,
  	LoginComponent,
    ProfileComponent,
    NotificationMessageComponent,
    LoginFormComponent,
    RegisterFormComponent,
    AdminComponent,
  ]
})
export class AuthModule { }
