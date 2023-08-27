import { createDestination } from '../mock/destinations-mock';
import { createListOffers } from '../mock/offers-mock';
import { createPoint } from '../mock/points-mock';
import { getRandomArrayElement, getRandomInteger } from '../utils/common';

const OFFERS_COUNT = 10;
const DESTINATIONS_COUNT = 10;
const POINTS_COUNT = 10;

export default class Service {
  points = [];
  offers = [];
  destinations = [];

  constructor() {
    this.offers = this.generateOffers();
    this.destinations = this.generateDestinations();
    this.points = this.generatePoints();
  }

  generatePoints() {

    return Array.from({ length: POINTS_COUNT }, (_, index) => {

      const destination = getRandomArrayElement(this.destinations);
      const randomOffers = getRandomArrayElement(this.offers).offers;

      const ids = [];
      const length = getRandomInteger(1, randomOffers.length);
      while (ids.length < length) {
        const currentElement = getRandomInteger(1, randomOffers.length);
        if (!ids.includes(currentElement)) {
          ids.push(currentElement);
        }
      }

      return createPoint(index, ids, destination.id);

    });

  }

  generateOffers() {
    return Array.from({ length: OFFERS_COUNT }, createListOffers);
  }

  generateDestinations() {
    return Array.from({ length: getRandomInteger(1, DESTINATIONS_COUNT) }, (_, index) => createDestination(index));
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getPoints() {
    return this.points;
  }
}

