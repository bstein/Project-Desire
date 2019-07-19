import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';
import {HeaderComponent} from './header/header.component';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    AppRoutingModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class SharedModule { }
