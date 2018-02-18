export class Operation {

  constructor(public id: number,
              public accountId: number, public accountTitle: string,
              public categoryId: number, public categoryTitle: string,
              public day: Date, public amount: number, public note: string) {
  }

}
