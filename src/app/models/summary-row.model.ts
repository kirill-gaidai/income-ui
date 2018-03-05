export class SummaryRow {

  constructor(public day: Date, public difference: number,
              public accountAmounts: number[], public accountAmountsSum: number,
              public categoryAmounts: number[], public categoryAmountsSum: number) {
  }

}
