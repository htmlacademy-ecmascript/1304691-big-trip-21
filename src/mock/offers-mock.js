import { getRandomArrayElement, getRandomInteger } from '../utils';
import { POINT_TYPES } from '../const';

const OFFER_TITLES = ['Add luggage', 'Switch to comfort ', 'Rent a car', 'Book tickets', 'Lunch in city', 'Order Uber', 'Add breakfast'];
const MIN_OFFER_PRICE = 20;
const MAX_OFFER_PRICE = 300;

const MIN_OFFER_COUNT = 0;
const MAX_OFFER_COUNT = 5;

function createOffer(index) {
  return {
    id: index,
    title: getRandomArrayElement(OFFER_TITLES),
    price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE)
  };
}

function createListOffers() {
  return {
    type: getRandomArrayElement(POINT_TYPES),
    offers: Array.from({ length: getRandomInteger(MIN_OFFER_COUNT, MAX_OFFER_COUNT)}, (_, index) => createOffer(index))
  };
}

export { createListOffers };
