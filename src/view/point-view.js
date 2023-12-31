import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';
import { humanizePointDate } from '../utils/common';
import { DATE_MONTH_FORMAT, DATE_TIME_FORMAT } from '../const';
import { encode } from 'he';

const DAY_IN_MILLISECONDS = 86400000;
const HOUR_IN_MILLISECONDS = 3600000;

dayjs.extend(Duration);

function getDifferenceDate(from, to) {
  const eventDuration = to.diff(from);
  let durationFormat = 'DD[D] HH[H] mm[M]';

  if (!eventDuration) {
    return '00D 00H 00M';
  }

  if (eventDuration < DAY_IN_MILLISECONDS) {
    durationFormat = 'HH[H] mm[M]';
  }

  if (eventDuration < HOUR_IN_MILLISECONDS) {
    durationFormat = 'mm[M]';
  }

  return dayjs.duration(eventDuration).format(durationFormat);
}

function isFavorite(value) {
  return value ? 'event__favorite-btn--active' : '';
}

function createOfferItem(offersId, offersByType) {
  let offersList = '';
  offersList = offersByType.offers
    .filter((offer) => offersId.includes(offer.id))
    .map((offer) => `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`).join('');


  return offersList;
}

function createPointTemplate(point, offersByType, destination) {
  const { basePrice, dateFrom, dateTo, type, isFavorite: favoriteValue, offers: offersId } = point;

  const offersList = createOfferItem(offersId, offersByType);

  const dateStartFormat = humanizePointDate(dateFrom, DATE_TIME_FORMAT);
  const dateEndFormat = humanizePointDate(dateTo, DATE_TIME_FORMAT);
  const dateMonthFormat = humanizePointDate(dateFrom, DATE_MONTH_FORMAT);

  const favoriteClassName = isFavorite(favoriteValue);

  const parseDateFrom = dayjs(dateFrom);
  const parseDateTo = dayjs(dateTo);

  const duration = getDifferenceDate(parseDateFrom, parseDateTo);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${dateMonthFormat}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${encode(type)}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${encode(type)} ${destination ? encode(destination.name) : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${dateStartFormat}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${dateEndFormat}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${encode(String(basePrice))}</span>
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
export default class PointView extends AbstractView {
  #point = null;
  #offers = null;
  #destination = null;
  #handleEditButtonClick = null;
  #handleFavoriteButtonClick = null;

  constructor({ point, offers, destination, onEditButtonClick, onFavoriteButtonClick }) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;

    this.#handleEditButtonClick = onEditButtonClick;
    this.#handleFavoriteButtonClick = onFavoriteButtonClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editButtonClickHandler);

    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteButtonClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destination);
  }

  #editButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditButtonClick();
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteButtonClick();
  };
}
