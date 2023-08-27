export default class OffersModel {
  #servise = null;
  #offers = null;

  constructor(servise) {
    this.#servise = servise;
    this.#offers = this.#servise.getOffers();
  }

  get offers() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }
}
