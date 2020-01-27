import { Component, OnInit } from '@angular/core';
import { Invoice } from './models/invoice.model';
import { InvoiceService } from './invoice.service';
import { AngularFireStorage, AngularFireUploadTask, StorageBucket } from '@angular/fire/storage' 
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'
import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.sass']
})
export class InvoiceComponent implements OnInit {
  title = 'invoicer';
  invoice:Invoice = new Invoice();
  url:string
  currentTab:string = "create"
  downloadURL:Observable<any>;
  uploadPercent:Observable<number>;
  uploadInProgress:boolean = false;
  downloadModalActive:boolean = false;
  emailModalActive:boolean = false;
  sendProcessing:boolean = false;
  user:any
  constructor(private invoiceService: InvoiceService, private storage: AngularFireStorage, public auth: AuthService, private http: HttpClient) {

      this.auth.user.subscribe((data)=>{
        console.log(data)
        if(data !== null) {
          this.user = data
          this.invoice.fromInfo = `${this.user.displayName}\n${this.user.BusinessName}\n${this.user.BusinessAddress}\n${this.user.BusinessCity} ${this.user.BusinessState}, ${this.user.BusinessZipcode}\n${this.user.BusinessPhone}\n${this.user.BusinessEmail}`
        }
      })
    
    
  }

  ngOnInit() {
    
  }
  // Dont enable generate button without the validation

  // Invoice validation
  invoiceValid() {
  	if(this.invoice.invoiceNo !== '' && this.currentTab !== "create" && this.invoice.fromInfo !== '' && this.invoice.toInfo !== '' && this.invoice.due !== '') {
  		return true
  	}
  		
  }

  // validate line items
  lineItemValidation() {
  	return true
  }


  generate() {
    //
    //there is a pixel offset
    // it is set to 500px
  	console.log('generating invoice....')
  	let invoiceHeight = document.getElementById('invoice').clientHeight
  	let invoiceWidth = document.getElementById('invoice').clientWidth
  	console.log('invoice height', invoiceHeight)
  	console.log('invoice Width', invoiceWidth)
	html2canvas(document.getElementById('invoice'), {
	  width: 1002,
	  height: invoiceHeight + 500,
    y: 500
	})
	.then((canvas) => {
		const imgData = canvas.toDataURL('image/png');

    // TODO: Add compression
		const pdf = new jsPDF({
		 orientation: 'p',
		 unit: 'px',
		 format: 'a4',
		 putOnlyUsedFonts:true
		});

		const imgProps= pdf.getImageProperties(imgData);
		console.log(pdf.getImageProperties(imgData))
		pdf.internal.pageSize.setWidth('600')
		pdf.internal.pageSize.setHeight('1000')
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
		console.log('imageprops hegiht', imgProps.height)
		pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Auto Download in brpwer
    const stamp = Date.now().toString();
		pdf.save('invoice-' +  stamp + '.pdf');
	});

  
  }

  uploadInvoice() {
    this.sendProcessing = true;
    let heightOffset = (100 + (this.invoice.lineItems.length * 5))*-1
    console.log('generating invoice....')
    let invoiceHeight = document.getElementById('invoice').clientHeight
    let invoiceWidth = document.getElementById('invoice').clientWidth
    console.log('invoice height', invoiceHeight)
    console.log('invoice Width', invoiceWidth)
    html2canvas(document.getElementById('invoice'), {
      width: 1002,
      height: invoiceHeight + 500,
      y: 500
    })
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // TODO: Add compression
      const pdf = new jsPDF({
       orientation: 'p',
       unit: 'px',
       format: 'a4',
       putOnlyUsedFonts:true
      });

      const imgProps= pdf.getImageProperties(imgData);
      console.log(pdf.getImageProperties(imgData))
      pdf.internal.pageSize.setWidth('600')
      pdf.internal.pageSize.setHeight('1000')
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      console.log('imageprops hegiht', imgProps.height)
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, 'FAST');

      // Blob for upload 
      let file = pdf.output('blob')

      //const filePath = Date.now().toString();
      const stamp = Date.now().toString();
      const fileRef = this.storage.ref('/invoices/invoice-' + stamp + '.pdf');
      const task = this.storage.upload('/invoices/invoice-' + stamp + '.pdf', file);

      // percent for pdf upload
      this.uploadPercent = task.percentageChanges();
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url) => {
           this.url = url
           console.log('url',this.url) 
           this.invoice.location = this.url;
           this.emailInvoice()
           this.sendProcessing = false;
          })
        })
      ).subscribe((data) => {
        console.log(this.uploadPercent)
        console.log(data)
      });

    });
  }


  emailInvoice() {
    this.sendProcessing = true;
    this.invoiceService.emailInvoice(this.invoice).then((data) => {
      console.log('data', data)
      this.sendProcessing = false;
      this.emailModalActive = false;
    })
  }

  downloadInvoiceHeadless() {

    // other wise it wont download
    const httpOptions = {
      responseType: 'blob' as 'json'
    };

    // save the invoice
    this.invoiceService.createInvoice(this.invoice).then((docRef) => {
      console.log('data', docRef.id)

      const stamp = Date.now().toString();
      var fileName = "invoice-" + stamp + ".pdf";
      var a = document.createElement("a");
      document.body.appendChild(a);

      // Headless invoice creation then place in link and invoke click
      this.http.get('https://us-central1-invoicer-6022f.cloudfunctions.net/api/screenshot?url=https://invoicer-6022f.firebaseapp.com/view/' + docRef.id, httpOptions).subscribe((data:Blob) => {
        const file = new Blob([data], { type: 'application/pdf' });
        const downloadURL = URL.createObjectURL(file);
        a.href = downloadURL;
        a.download = fileName;
        a.click();
      });

    });
  }

  saveInvoice() {
    console.log('triggered')
    this.invoiceService.saveInvoice(this.invoice).then((data)=>{
      console.log('data', data)
    })
  }

}
