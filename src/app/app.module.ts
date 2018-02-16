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
    CategoryItemComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    CurrencyService,
    CategoryService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
