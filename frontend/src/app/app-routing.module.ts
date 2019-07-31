import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [];
/*[
  { path: 'history', component: HistoryComponent },
  { path: 'account', component: AccountlComponent },
  {
    path: 'ship',
    component: ShipComponent,
    data: { title: 'Ship' }
  },
  { path: '',
    redirectTo: '/ship',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];*/

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
