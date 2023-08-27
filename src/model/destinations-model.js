export default class DestinationsModel {
  #servise = null;
  #destinations = null;

  constructor(servise) {
    this.#servise = servise;
    this.#destinations = this.#servise.getDestinations();
  }

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
