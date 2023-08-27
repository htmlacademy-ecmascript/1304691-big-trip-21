import dayjs from 'dayjs';
import { getRandomInteger } from '../utils/common';

const Ranges = {
  DAYS: {
    MIN: 0,
    MAX: 3
  },
  HOURS: {
    MIN: 1,
    MAX: 10
  },
  MINUTES: {
    MIN: 1,
    MAX: 59
  }
};

function getRandomDate() {
  const index = Boolean(getRandomInteger(0, 1));

  if (index) {
    return dayjs().add(getRandomInteger(Ranges.DAYS.MIN, Ranges.DAYS.MAX), 'day')
      .add(getRandomInteger(Ranges.HOURS.MIN, Ranges.HOURS.MAX), 'hour')
      .add(getRandomInteger(Ranges.MINUTES.MIN, Ranges.MINUTES.MAX), 'minute');
  }

  return dayjs().subtract(getRandomInteger(Ranges.DAYS.MIN, Ranges.DAYS.MAX), 'day');
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

