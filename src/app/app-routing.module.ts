import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component'


const routes: Routes = [
	{
		path: '', component: InvoiceComponent
	},
	{
		path: 'login',
		loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./user/user.module').then(m => m.UserModule)
	},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
