import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShipBaseComponent as ShipBaseComponent } from './ship/ship-base/ship-base.component';
import { ShipAddressCollectionComponent as ShipAddressCollectionComponent } from './ship/ship-address-collection/ship-address-collection.component';
import { HistoryComponent } from './history/history.component';
import { AccountComponent } from './account/account.component';
import { AccountLoginComponent } from './account-login/account-login.component';

const routes: Routes = [
  { path: 'history', component: HistoryComponent },
  { path: 'account', component: AccountComponent },
  { path: 'account/login', component: AccountLoginComponent },
  {
    path: 'ship',
    component: ShipBaseComponent,
    children: [
      { path: '', component: ShipAddressCollectionComponent },
      { path: '1',
        redirectTo: '',
        pathMatch: 'full'
      } //,
      // { path: '2', component: ShipPackageDetailComponent },
      // { path: '3', component: ShipQuotesComponent },
      // { path: '4', component: ShipConfirmationComponent },
      // { path: '5', component: ShipLabelReadyCoomponent }
    ]
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
