import { createDestination } from '../mock/destinations-mock';
import { createListOffers } from '../mock/offers-mock';
import { getRandomInteger } from '../utils/common';

const OFFERS_COUNT = 10;
const DESTINATIONS_COUNT = 10;
export default class Service {
  points = [];
  offers = [];
  destinations = [];

  pointsApiService = null;

  constructor({ pointsApiService }) {
    this.pointsApiService = pointsApiService;
    this.offers = this.generateOffers();
    this.destinations = this.generateDestinations();
  }

  async init() {
    try {
      const points = await this.pointsApiService.points;
      this.points = points.map(this.adaptToClient);
    } catch (err) {
      this.points = [];
    }
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

  getPointsApiService() {
    return this.pointsApiService;
  }
}

