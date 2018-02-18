import {Balance} from './balance.model';
import {Operation} from './operation.model';

export class SummaryRow {

  constructor(public day: Date, public difference: number,
              public accountAmounts: number[], public balances: Balance[], public accountAmountsSum: number,
              public categoryAmounts: number[], public operations: Operation[][], public categoryAmountsSum: number) {
  }

}
