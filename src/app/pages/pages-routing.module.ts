import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ViewComponent } from './view/view.component'
import { PrivacyComponent } from './privacy/privacy.component'
import { TosComponent } from './tos/tos.component'


const routes: Routes = [
	{
		path: 'privacy', component: PrivacyComponent
	},
	{
		path: 'tos', component: TosComponent
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }