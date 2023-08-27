import { getRandomArrayElement, getRandomInteger } from '../utils';
import { createRandomDates } from '../mock/dates';
import { POINT_TYPES } from '../const';

const MIN_PRICE = 100;
const MAX_PRICE = 10000;

function createPoint(index, ids, destinationId) {
  const randomDates = createRandomDates();

  return {
    id: index,
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: randomDates.dateFrom,
    dateTo: randomDates.dateTo,
    destination: destinationId,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: ids,
    type: getRandomArrayElement(POINT_TYPES)
  };
}

export { createPoint };

