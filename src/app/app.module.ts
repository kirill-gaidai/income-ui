import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {DropdownDirective} from './directives/dropdown.directive';
import {HomeComponent} from './home/home.component';
import {CurrenciesComponent} from './directories/currencies/currencies.component';
import {AppRoutingModule} from './app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {CurrencyService} from './services/currency.service';
import {CurrencyItemComponent} from './directories/currencies/currency-item/currency-item.component';
import {CurrencyEditComponent} from './directories/currencies/currency-edit/currency-edit.component';
import {CategoriesComponent} from './directories/categories/categories.component';
import {CategoryEditComponent} from './directories/categories/category-edit/category-edit.component';
import {CategoryItemComponent} from './directories/categories/category-item/category-item.component';
import {CategoryService} from './services/category.service';
import {AccountsComponent} from './directories/accounts/accounts.component';
import {AccountItemComponent} from './directories/accounts/account-item/account-item.component';
import {AccountEditComponent} from './directories/accounts/account-edit/account-edit.component';
import {AccountService} from './services/account.service';
import {SummariesComponent} from './summaries/summaries.component';
import {SummaryService} from './services/summary.service';
import {BalanceComponent} from './summaries/balance/balance.component';
import {OperationsComponent} from './summaries/operations/operations.component';
import {OperationService} from './services/operation.service';
import {BalanceService} from './services/balance.service';
import {OperationItemComponent} from './summaries/operations/operation-item/operation-item.component';
import {OperationEditComponent} from './summaries/operations/operation-edit/operation-edit.component';

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
    SummariesComponent,
    BalanceComponent,
    OperationsComponent,
    OperationItemComponent,
    OperationEditComponent
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
    AccountService,
    SummaryService,
    BalanceService,
    OperationService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
