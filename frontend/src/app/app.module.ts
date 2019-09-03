import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';
// import { MatFormFieldModule } from '@angular/material/form-field'; 


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ShipAddressCollectionComponent } from './ship/ship-address-collection/ship-address-collection.component';
import { ShipBaseComponent } from './ship/ship-base/ship-base.component';
import { HistoryComponent } from './history/history.component';
import { AccountComponent } from './account/account.component';
import { AccountLoginComponent } from './account-login/account-login.component';
import { AddressFormComponent } from './address-form/address-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShipBaseComponent,
    ShipAddressCollectionComponent,
    HistoryComponent,
    AccountComponent,
    AccountLoginComponent,
    AddressFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
