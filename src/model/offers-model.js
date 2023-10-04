export default class OffersModel {
  #service = null;
  #offers = null;

  constructor(service) {
    this.#service = service;
  }

  async init() {
    this.#offers = await this.#service.getOffers();
    return this.#offers;
  }

  get offers() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }
}
