import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ShipComponent } from './ship/ship.component';
import { HistoryComponent } from './history/history.component';
import { AccountComponent } from './account/account.component';
import { AccountLoginComponent } from './account-login/account-login.component';
import { AccountLoginVerifyComponent } from './account-login-verify/account-login-verify.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShipComponent,
    HistoryComponent,
    AccountComponent,
    AccountLoginComponent,
    AccountLoginVerifyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
