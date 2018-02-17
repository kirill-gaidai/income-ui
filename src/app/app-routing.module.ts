import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {CurrenciesComponent} from './directories/currencies/currencies.component';
import {CurrencyEditComponent} from './directories/currencies/currency-edit/currency-edit.component';
import {CurrencyItemComponent} from './directories/currencies/currency-item/currency-item.component';
import {CategoriesComponent} from './directories/categories/categories.component';
import {CategoryEditComponent} from './directories/categories/category-edit/category-edit.component';
import {CategoryItemComponent} from './directories/categories/category-item/category-item.component';
import {AccountsComponent} from './directories/accounts/accounts.component';
import {AccountEditComponent} from './directories/accounts/account-edit/account-edit.component';
import {AccountItemComponent} from './directories/accounts/account-item/account-item.component';
import {SummariesComponent} from './summaries/summaries.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {
    path: 'directories', children: [
      {
        path: 'currencies', component: CurrenciesComponent, children: [
          {path: 'new', component: CurrencyEditComponent},
          {path: ':id', component: CurrencyItemComponent},
          {path: ':id/edit', component: CurrencyEditComponent}
        ]
      },
      {
        path: 'categories', component: CategoriesComponent, children: [
          {path: 'new', component: CategoryEditComponent},
          {path: ':id', component: CategoryItemComponent},
          {path: ':id/edit', component: CategoryEditComponent}
        ]
      },
      {
        path: 'accounts', component: AccountsComponent, children: [
          {path: 'new', component: AccountEditComponent},
          {path: ':id', component: AccountItemComponent},
          {path: ':id/edit', component: AccountEditComponent}
        ]
      }
    ]
  },
  {path: 'summaries', component: SummariesComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
