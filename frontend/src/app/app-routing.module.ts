import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShipComponent } from './ship/ship.component';
import { HistoryComponent } from './history/history.component';
import { AccountComponent } from './account/account.component';
import { AccountLoginComponent } from './account-login/account-login.component';

const routes: Routes = [
  { path: 'history', component: HistoryComponent },
  { path: 'account', component: AccountComponent },
  { path: 'account/login', component: AccountLoginComponent },
  {
    path: 'ship',
    component: ShipComponent,
    data: { title: 'Ship' }
  },
  { path: '',
    redirectTo: '/ship',
    pathMatch: 'full'
  }
  //, { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
