import { getRandomArrayElement, getRandomInteger } from '../utils';
import { createRandomDates } from '../mock/dates';
import { POINT_TYPES } from '../const';
//import { createListOffers } from './offers-mock';
// import { createDestination } from './destinations-mock';

const MIN_PRICE = 100;
const MAX_PRICE = 10000;

//const offers = Array.from({ length: OFFERS_COUNT }, createListOffers);
// const destinations = Array.from({ length: getRandomInteger(1, DESTINATIONS_COUNT) }, (_, index) => createDestination(index));

// function getRandomIds() {
//   const randomOffers = getRandomArrayElement(offers).offers;

//   const ids = [];
//   const length = getRandomInteger(1, randomOffers.length);
//   while (ids.length < length) {
//     const currentElement = getRandomInteger(1, randomOffers.length);
//     if (!ids.includes(currentElement)) {
//       ids.push(currentElement);
//     }
//   }
//   return ids;
// }

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

