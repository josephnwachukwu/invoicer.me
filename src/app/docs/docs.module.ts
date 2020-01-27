import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsRoutingModule } from './docs-routing.module';
import { DocumentationComponent } from './documentation/documentation.component';


@NgModule({
  declarations: [DocumentationComponent],
  imports: [
    CommonModule,
    DocsRoutingModule
  ]
})
export class DocsModule { }
