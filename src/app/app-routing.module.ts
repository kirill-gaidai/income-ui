import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {CurrenciesComponent} from './directories/currencies/currencies.component';
import {CurrencyEditComponent} from './directories/currencies/currency-edit/currency-edit.component';
import {CurrencyItemComponent} from './directories/currencies/currency-item/currency-item.component';

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
      }
    ]
  }
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
