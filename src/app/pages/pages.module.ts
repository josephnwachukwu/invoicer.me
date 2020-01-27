import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TosComponent } from './tos/tos.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PagesRoutingModule } from './pages-routing.module'


@NgModule({
  declarations: [TosComponent, PrivacyComponent],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
