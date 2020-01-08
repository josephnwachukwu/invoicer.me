import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

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

  getInvoice<Observable>(id:string) {
    return this.db.collection('invoices').doc(id).valueChanges();
  }

}
