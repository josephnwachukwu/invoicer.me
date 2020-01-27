import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentationComponent } from './documentation/documentation.component'
//import { PrivacyComponent } from './privacy/privacy.component'
//import { TosComponent } from './tos/tos.component'


const routes: Routes = [
	{
		path: 'documentation', component: DocumentationComponent
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }