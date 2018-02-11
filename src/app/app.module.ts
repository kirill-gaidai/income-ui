import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {DropdownDirective} from './directives/dropdown.directive';
import { HomeComponent } from './home/home.component';
import { CurrenciesComponent } from './directories/currencies/currencies.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {CurrencyService} from './services/currency.service';
import { CurrencyItemComponent } from './directories/currencies/currency-item/currency-item.component';
import { CurrencyEditComponent } from './directories/currencies/currency-edit/currency-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
    HomeComponent,
    CurrenciesComponent,
    CurrencyItemComponent,
    CurrencyEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    CurrencyService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
