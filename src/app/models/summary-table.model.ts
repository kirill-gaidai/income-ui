import {SummaryRow} from './summary-row.model';

export class SummaryTable {

  constructor(public accountTitles: string[],
              public categoryTitles: string[],
              public accountIds: number[],
              public categoryIds: number[],
              public rows: SummaryRow[],
              public categoryAmounts: number[],
              public categoryAmountsSum: number) {
  }

}
