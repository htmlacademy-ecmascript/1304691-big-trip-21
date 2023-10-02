import dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';

dayjs.extend(Duration);

function isEscapeKey(evt) {
  return evt.key === 'Escape' || evt.key === 'Esc';
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function getDifference(from, to) {
  const parseDateFrom = dayjs(from);
  const parseDateTo = dayjs(to);

  const eventDuration = parseDateTo.diff(parseDateFrom);

  return dayjs.duration(eventDuration);
}

function getRandomInteger(min, max) {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeFirstLetterToLower(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortPointsByTime(pointA, pointB) {
  const PointADuration = getDifference(pointA.dateFrom, pointA.dateTo);
  const PointBDuration = getDifference(pointB.dateFrom, pointB.dateTo);
  const weight = getWeightForNullDate(PointADuration, PointBDuration);

  return weight ?? dayjs(PointBDuration.format()).diff(PointADuration.format());
}

function sortPointsByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortPointsByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);
}

function isDatesEqual(dateA, dateB) {
  return dayjs(dateA).isSame(dateB, 'D');
}

export {
  isEscapeKey,
  getRandomArrayElement,
  getRandomInteger,
  humanizePointDate,
  capitalizeFirstLetter,
  getDifference,
  sortPointsByTime,
  sortPointsByPrice,
  sortPointsByDay,
  isDatesEqual,
  capitalizeFirstLetterToLower
};
