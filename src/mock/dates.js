import dayjs from 'dayjs';
import { getRandomInteger } from '../utils';

const Ranges = {
  DAYS: {
    MIN: 1,
    MAX: 3
  },
  HOURS: {
    MIN: 1,
    MAX: 23
  },
  MINUTES: {
    MIN: 1,
    MAX: 59
  }
};

function getRandomDate() {
  return dayjs().add(getRandomInteger(Ranges.DAYS.MIN, Ranges.DAYS.MAX), 'day')
    .add(getRandomInteger(Ranges.HOURS.MIN, Ranges.HOURS.MAX), 'hour')
    .add(getRandomInteger(Ranges.MINUTES.MIN, Ranges.MINUTES.MAX), 'minute');
}

function createRandomDates() {
  const dateFrom = getRandomDate();
  const dateTo = getRandomDate();

  if (dateTo.isAfter(dateFrom)) {
    return {
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
    };
  }

  return {
    dateFrom: dateTo.toISOString(),
    dateTo: dateFrom.toISOString(),
  };
}

export { createRandomDates };

