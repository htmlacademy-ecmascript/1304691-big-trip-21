import dayjs from 'dayjs';

const DAY_IN_SECONDS = 86400;
const DAY_IN_HOURS = 24;
const HOUR_IN_MINUTES = 60;
const HOUR_IN_SECONDS = 3600;

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function calculateDurationDate(to, from) {
  let difference = dayjs(to).diff(from, 'second');

  const days = Math.floor(difference / DAY_IN_SECONDS);
  difference -= days * DAY_IN_SECONDS;

  const hours = Math.floor(difference / HOUR_IN_SECONDS % DAY_IN_HOURS);
  difference -= hours * HOUR_IN_SECONDS;

  const minutes = Math.floor(difference / HOUR_IN_MINUTES % HOUR_IN_MINUTES);
  difference -= minutes * HOUR_IN_MINUTES;

  const duration = `${days}D ${hours}H ${minutes}M`;

  return duration;
}

export { getRandomArrayElement, humanizePointDate, calculateDurationDate };
