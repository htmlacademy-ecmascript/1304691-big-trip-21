export default class DestinationsModel {
  #service = null;
  #destinations = ['fggfg'];

  constructor(service) {
    this.#service = service;
  }

  async init() {
    this.#destinations = await this.#service.getDestinations();
    return this.#destinations;
  }

  get destinations() {
    console.log(this.#destinations)
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
