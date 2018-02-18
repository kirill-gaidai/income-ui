export class DateUtil {

  public static dateToStr(value: Date): string {
    const year: string = '' + value.getFullYear();
    let month: string = value.getMonth() + 1 + '';
    if (month.length === 1) {
      month = '0' + month;
    }
    let day: string = value.getDate() + '';
    if (day.length === 1) {
      day = '0' + day;
    }
    return year + '-' + month + '-' + day;
  }

  public static strToDate(value: string): Date {
    const tokens: string[] = value.split('-');
    return new Date(+tokens[0], +tokens[1] - 1, +tokens[2]);
  }

  public static cloneDate(value: Date): Date {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  public static incrementDay(value: Date): Date {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate() + 1);
  }

}
