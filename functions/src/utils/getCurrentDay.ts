export default function () {
  const phTimeZone = 8 * 60 * 60 * 1000;
  const date = Date.now();

  const sequencedDay = 14;

  const day0 = new Date(`October ${sequencedDay}, 2022`).getTime() - phTimeZone;
  const day1 =
    new Date(`October ${sequencedDay + 1}, 2022`).getTime() - phTimeZone;
  const day2 =
    new Date(`October ${sequencedDay + 2}, 2022`).getTime() - phTimeZone;
  const day3 =
    new Date(`October ${sequencedDay + 3}, 2022`).getTime() - phTimeZone;
  const ended =
    new Date(`October ${sequencedDay + 4}, 2022`).getTime() - phTimeZone;

  if (date > ended) {
    return -1;
  }

  if (date > day3) {
    return 3;
  }

  if (date > day2) {
    return 2;
  }

  if (date > day1) {
    return 1;
  }

  // patca event
  if (date > day0 && date < day1) {
    return 0;
  }

  return -2;
}
