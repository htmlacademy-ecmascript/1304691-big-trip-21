import AbstractView from '../framework/view/abstract-view.js';
import { getTripTitle, getTripDuration, getTripCost } from '../utils/trip-info.js';

function createInfoTemplate({ isEmpty, title, duration, cost }) {
  if (isEmpty) {
    return '<div></div>';
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${duration}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`
  );
}
export default class InfoView extends AbstractView {
  #destinations = null;
  #offers = null;
  #points = 0;

  constructor({ destinations, offers, points }) {
    super();

    this.#destinations = destinations;
    this.#offers = offers;
    this.#points = points;
  }

  get template() {
    return createInfoTemplate({
      isEmpty: this.#points.length === 0,
      title: getTripTitle(this.#points, this.#destinations),
      duration: getTripDuration(this.#points),
      cost: getTripCost(this.#points, this.#offers)
    });
  }
}
