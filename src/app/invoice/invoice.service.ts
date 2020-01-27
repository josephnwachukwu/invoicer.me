import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {


  invoices = null;
  subscription;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private http: HttpClient) { }



  subscribeToInvoices(id) {
    if (!this.invoices) {
      this.subscription = this.db.collection('invoices').valueChanges({uid: id})
      .subscribe(invoices =>  {
        this.invoices = invoices;
      });
    }
  }

  async createInvoice(invoice) {
    const user = await this.afAuth.auth.currentUser;
    // have to make the list a custom object very annoying
    const itemList = invoice.lineItems.map((obj)=> {return Object.assign({}, obj)})
    if(user && user.uid) {
      return this.db.collection('invoices').add({
        ...invoice,
        uid: user.uid || 'tempUser',
        lineItems: itemList
      });
    }
    else {
      return this.db.collection('invoices').add({
        ...invoice,
        uid: 'tempUser',
        lineItems: itemList
      });
    }

   
  }

 async emailInvoice(invoice) {
   const user = await this.afAuth.auth.currentUser;
    // have to make the list a custom object very annoying
    const itemList = invoice.lineItems.map((obj)=> {return Object.assign({}, obj)})
    let payload = {}
    if(user && user.uid) {
      payload = {
        ...invoice,
        uid: user.uid || 'tempUser',
        lineItems: itemList
      }
    }
    else {
      payload = {
        ...invoice,
        uid: 'tempUser',
        lineItems: itemList
      }
    }

    this.http.post("https://us-central1-invoicer-6022f.cloudfunctions.net/api/emailInvoice", payload).subscribe((data)=>{

    })
 }

  async saveInvoice(invoice) {
    console.log('triggered service')
    const user = await this.afAuth.auth.currentUser;
    // have to make the list a custom object very annoying
    const itemList = invoice.lineItems.map((obj)=> {return Object.assign({}, obj)})
    let payload = {}
    if(user && user.uid) {
      payload = {
        ...invoice,
        uid: user.uid || 'tempUser',
        lineItems: itemList
      }
    }
    else {
      payload = {
        ...invoice,
        uid: 'tempUser',
        lineItems: itemList
      }
    }

    this.http.post("https://us-central1-invoicer-6022f.cloudfunctions.net/api/saveInvoice", payload).subscribe((data)=>{

    })
  }

  getInvoice<Observable>(id:string) {
    return this.db.collection('invoices').doc(id).valueChanges();
  }

}
