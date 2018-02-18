export class Balance {

  constructor(public accountId: number, public accountTitle: string,
              public day: Date, public amount: number, public manual: boolean) {
  }

}
