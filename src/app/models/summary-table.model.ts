import {SummaryRow} from './summary-row.model';

export class SummaryTable {

  constructor(public accountTitles: string[],
              public categoryTitles: string[],
              public rows: SummaryRow[]) {
  }

}
