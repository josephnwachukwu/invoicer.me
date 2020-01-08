import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features-routing.module';
import { ViewComponent } from './view/view.component';
import { InvoiceModule } from '../invoice/invoice.module';

@NgModule({
  declarations: [ViewComponent],
  imports: [
    CommonModule,
    FeaturesRoutingModule
  ]
})
export class FeaturesModule { }
