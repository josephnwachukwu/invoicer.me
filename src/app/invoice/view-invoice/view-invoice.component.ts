import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from '../models/invoice.model'
@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.sass']
})
export class ViewInvoiceComponent implements OnInit {
	@Input() invoice: Invoice
	dueTerms: any[]
  constructor() { 

  }

  ngOnInit() {
  }



}
