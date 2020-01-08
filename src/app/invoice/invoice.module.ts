import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceService } from './invoice.service'
import { AuthService } from '../auth/auth.service';

// Firebase imports
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage'

@NgModule({
  declarations: [
  	InvoiceComponent,
  	ViewInvoiceComponent,
  	CreateInvoiceComponent
  	],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
  	InvoiceService
  ]
})
export class InvoiceModule { }


