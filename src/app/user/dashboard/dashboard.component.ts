import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service'
import { AngularFirestore } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';
import { InvoiceService } from '../../invoice/invoice.service';
import { AngularFireStorage, AngularFireUploadTask, StorageBucket } from '@angular/fire/storage' 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

	user:any
  constructor(public auth: AuthService, public invoiceService: InvoiceService) { 
  	

  	this.auth.user.subscribe((data)=>{
        console.log(data)
        if(data !== null) {
          this.user = data
          this.invoiceService.subscribeToInvoices(this.user.id);
        }
      })
  }

  ngOnInit() {
  	
  }

}
