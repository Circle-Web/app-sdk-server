export default class TimeUtil {

  public static ONE_SECOND_MILLS = 1000;
  public static ONE_MINUTE_DURATION = 60;
  public static ONE_HOUR_DURATION = 60 * 60;
  public static HOURS_PER_DAY = 24;
  public static ONE_DAY_DURATION = TimeUtil.HOURS_PER_DAY * 60 * 60;
  public static ONE_WEEK_DURATION = 7 * 24 * 60 * 60;
  public static ONE_MINUTE_MILLS = TimeUtil.ONE_MINUTE_DURATION * TimeUtil.ONE_SECOND_MILLS;
  public static ONE_HOUR_DURATION_MILLIS = TimeUtil.ONE_HOUR_DURATION * TimeUtil.ONE_SECOND_MILLS;
  public static ONE_DAY_DURATION_MILLIS = TimeUtil.ONE_DAY_DURATION * TimeUtil.ONE_SECOND_MILLS;
  public static MAX_DATE = new Date(new Date().setFullYear(2099, 1, 1))

  public static isTodayDate(date: Date) {
    return this.getDiffDayWithH0(new Date(date), new Date()) == 0
  }

  public static isSameDate(dateA: Date, dateB: Date) {
    return dateA.toISOString() === dateB.toISOString();
  }

  static getDiffDayWithH0(start: Date, end: Date) {
    const diffMills = end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)
    return diffMills / TimeUtil.ONE_HOUR_DURATION_MILLIS
  }

}