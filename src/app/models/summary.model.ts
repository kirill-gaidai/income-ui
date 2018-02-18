import {Currency} from './currency.model';
import {Category} from './category.model';
import {Balance} from './balance.model';
import {Operation} from './operation.model';
import {Account} from './account.model';

export class Summary {

  constructor(public firstDay: Date, public lastDay: Date,
              public currency: Currency, public accounts: Account[], public categories: Category[],
              public initialBalances: Balance[], public balances: Balance[],
              public operations: Operation[]) {
  }

}
