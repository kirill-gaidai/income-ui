import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {DropdownDirective} from './directives/dropdown.directive';
import { HomeComponent } from './home/home.component';
import { CurrenciesComponent } from './directories/currencies/currencies.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {CurrencyService} from './services/currency.service';
import { CurrencyItemComponent } from './directories/currencies/currency-item/currency-item.component';
import { CurrencyEditComponent } from './directories/currencies/currency-edit/currency-edit.component';
import { CategoriesComponent } from './directories/categories/categories.component';
import { CategoryEditComponent } from './directories/categories/category-edit/category-edit.component';
import { CategoryItemComponent } from './directories/categories/category-item/category-item.component';
import {CategoryService} from './services/category.service';
import { AccountsComponent } from './directories/accounts/accounts.component';
import { AccountItemComponent } from './directories/accounts/account-item/account-item.component';
import { AccountEditComponent } from './directories/accounts/account-edit/account-edit.component';
import {AccountService} from './services/account.service';
import { SummariesComponent } from './summaries/summaries.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
    HomeComponent,
    CurrenciesComponent,
    CurrencyItemComponent,
    CurrencyEditComponent,
    CategoriesComponent,
    CategoryEditComponent,
    CategoryItemComponent,
    AccountsComponent,
    AccountItemComponent,
    AccountEditComponent,
    SummariesComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    CurrencyService,
    CategoryService,
    AccountService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
