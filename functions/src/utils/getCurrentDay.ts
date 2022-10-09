export default function () {
  const phTimeZone = 8 * 60 * 60 * 1000;
  const date = Date.now();
  const day1 = new Date("October 10, 2022").getTime() - phTimeZone;
  const day2 = new Date("October 11, 2022").getTime() - phTimeZone;
  const day3 = new Date("October 12, 2022").getTime() - phTimeZone;

  if (date > day3) {
    return 3;
  }
  if (date > day2) {
    return 2;
  }
  if (date > day1 && date < day2) {
    return 1;
  }

  return 0;
}
