import dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';

dayjs.extend(Duration);

function isEscapeKey(evt) {
  return evt.key === 'Escape' || evt.key === 'Esc';
}

function humanizePointDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function getDifferenceDate(from, to) {
  const parseDateFrom = dayjs(from);
  const parseDateTo = dayjs(to);

  const eventDuration = parseDateTo.diff(parseDateFrom);

  return dayjs.duration(eventDuration);
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
  const PointADuration = getDifferenceDate(pointA.dateFrom, pointA.dateTo);
  const PointBDuration = getDifferenceDate(pointB.dateFrom, pointB.dateTo);
  const weight = getWeightForNullDate(PointADuration, PointBDuration);

  return weight ?? dayjs(PointBDuration.format()).diff(PointADuration.format());
}

function sortPointsByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortPointsByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);
}

function isBigDifference(pointA, pointB) {
  return pointA.dateFrom !== pointB.dateFrom || pointA.basePrice !== pointB.basePrice || getDifferenceDate(pointA.dateFrom, pointA.dateTo) !== getDifferenceDate(pointB.dateFrom, pointB.dateTo);
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function adaptToServer(point) {
  const adaptedPoint = {
    ...point,
    ['base_price']: point.basePrice,
    ['date_from']: new Date(point.dateFrom).toISOString(),
    ['date_to']: new Date(point.dateTo).toISOString(),
    ['is_favorite']: point.isFavorite,
  };

  delete adaptedPoint.basePrice;
  delete adaptedPoint.dateFrom;
  delete adaptedPoint.dateTo;
  delete adaptedPoint.isFavorite;

  return adaptedPoint;
}

function adaptToClient(point) {
  const adaptedPoint = {
    ...point,
    basePrice: point['base_price'],
    dateFrom: point['date_from'],
    dateTo: point['date_to'],
    isFavorite: point['is_favorite'],
  };

  delete adaptedPoint['base_price'];
  delete adaptedPoint['date_from'];
  delete adaptedPoint['date_to'];
  delete adaptedPoint['is_favorite'];

  return adaptedPoint;
}

export {
  isEscapeKey,
  humanizePointDate,
  capitalizeFirstLetter,
  sortPointsByTime,
  sortPointsByPrice,
  sortPointsByDay,
  isBigDifference,
  capitalizeFirstLetterToLower,
  updateItem,
  adaptToServer,
  adaptToClient
};
