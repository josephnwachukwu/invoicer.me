import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InvoiceService } from '../../invoice/invoice.service';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass']
})
export class ViewComponent implements OnInit {
	invoice:any
  constructor(private router: ActivatedRoute, private invoiceService: InvoiceService) { 
  	const invoiceId: string = router.snapshot.params["id"];
  	console.log(`id : ${invoiceId}`)
  	// sameple id: vSAliUh9zaVuVJML4yG5
  	// this.invoiceService.getInvoice(invoiceId).success((data) => {

  	// })

  	this.invoice = this.invoiceService.getInvoice(invoiceId)
      .pipe(
        tap((data) =>
          console.log("data", data)
        )
      );
      console.log(this.invoice)
  }

  ngOnInit() {
  }

}
