import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from '../models/invoice.model'
import { LineItem } from '../models/lineItem.model'

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.sass']
})
export class CreateInvoiceComponent implements OnInit {
	@Input() invoice: Invoice
  constructor() { }

  ngOnInit() {
  }

  addLineItem() {
  	let lineItem = new LineItem()
  	this.invoice.lineItems.push(lineItem)
  }

  removeLineItem(ind) {
  	if(this.invoice.lineItems.length >= 2) {
  		this.invoice.lineItems.splice(ind,1)
  	}
  }

  updateLineItem(ind) {
  	this.invoice.lineItems[ind].quantity = parseInt(this.invoice.lineItems[ind].quantity)
  	this.invoice.lineItems[ind].rate = parseInt(this.invoice.lineItems[ind].rate)
  	console.log('is change working', this.invoice.lineItems[ind])
  	this.invoice.lineItems[ind].amount = parseInt(this.invoice.lineItems[ind].quantity) * parseInt(this.invoice.lineItems[ind].rate)
  	console.log(parseInt(this.invoice.lineItems[ind].amount))
  	this.updateTrueTotal()
  }

  // Recalculate Everything
  updateTrueTotal() {
  	this.invoice.subtotal = 0
  	this.invoice.total = 0;

  	for(let i in this.invoice.lineItems) {
  		this.invoice.subtotal += parseInt(this.invoice.lineItems[i].amount)
  		this.invoice.total = this.invoice.subtotal
  	}

  	if(this.invoice.hasTax && this.invoice.tax > 0) {
  		let taxAmt = this.invoice.total * (this.invoice.tax / 100)
  		this.invoice.total = this.invoice.total + taxAmt
  	}
  	if(this.invoice.hasDiscount && this.invoice.discount > 0) {
  		this.invoice.total = this.invoice.total - this.invoice.discount
  	}

  	if(this.invoice.hasPaidPartial && this.invoice.amountPaid > 0) {
  		this.invoice.total = this.invoice.total - this.invoice.amountPaid
  	}

  	if(this.invoice.hasShipping && this.invoice.shipping > 0) {
  		this.invoice.total = this.invoice.total + this.invoice.amountPaid
  	}

  }

}
