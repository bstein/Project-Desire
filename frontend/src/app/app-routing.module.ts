import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShipComponent } from './ship/ship.component';
import { HistoryComponent } from './history/history.component';
import { AccountComponent } from './account/account.component';
import { AccountLoginComponent } from './account-login/account-login.component';
import { AccountLoginVerifyComponent } from './account-login-verify/account-login-verify.component';

const routes: Routes = [
  { path: 'history', component: HistoryComponent },
  { path: 'account', component: AccountComponent },
  { path: 'account/login', component: AccountLoginComponent },
  // NOTE - This module is no longer in use
  // { path: 'account/login/verify', component: AccountLoginVerifyComponent },
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
