import { createElement } from '../render';
import { humanizePointDate, calculateDurationDate } from '../utils';
import { DATE_MONTH_FORMAT, DATE_TIME_FORMAT } from '../const';

function createOffer(data) {
  return data.map(({title, price})=> `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`
  ).join('');
}

function isFavorite(value) {
  return value ? 'event__favorite-btn--active' : '';
}

function createPointTemplate(point) {
  const { basePrice, dateFrom, dateTo, type: typePoint, destination, offers, isFavorite: favoriteValue } = point;
  const { name } = destination;
  const { offers: offersData } = offers;

  const dateStartFormat = humanizePointDate(dateFrom, DATE_TIME_FORMAT);
  const dateEndFormat = humanizePointDate(dateTo, DATE_TIME_FORMAT);
  const dateMonthFormat = humanizePointDate(dateFrom, DATE_MONTH_FORMAT);

  const duration = calculateDurationDate(dateTo, dateFrom);

  const offersList = createOffer(offersData);
  const favoriteClassName = isFavorite(favoriteValue);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${dateMonthFormat}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typePoint}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typePoint} ${name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${dateStartFormat}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${dateEndFormat}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">${offersList}</ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}
export default class PointView {
  constructor({ point }) {
    this.point = point;
  }

  getTemplate() {
    return createPointTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
