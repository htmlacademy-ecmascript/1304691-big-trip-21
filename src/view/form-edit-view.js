import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { FULL_DATE_TIME_FORMAT } from '../const';
import { humanizePointDate, capitalizeFirstLetterToLower } from '../utils/common';
import { POINT_EMPTY } from '../const';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createTypelist([...types]) {
  return types.map((type) => `<div class="event__type-item">
    <input id="event-type-${capitalizeFirstLetterToLower(type)}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${capitalizeFirstLetterToLower(type)}" for="event-type-${capitalizeFirstLetterToLower(type)}-1">${type}</label>
  </div>`).join('');
}

function createDestinationsList(destinations) {
  if (destinations) {
    return `<datalist id="destination-list-1">${createDestinationsItems(destinations)}</datalist>`;
  }
}

function createDestinationsItems(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');
}

function createOfferItem(offersByType, offersId) {
  if (offersByType) {
    return offersByType.offers.map(({ title, price, id }) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}" data-id="${id}" type="checkbox" name="event-offer-luggage" ${offersId.includes(id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-luggage-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
    </div>`
    ).join('');
  }
}

function createDestinationImg(destination) {
  if (destination) {
    return destination.pictures.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}" />
  `).join('');
  }
}

function createFormTemplate({ state, destinations, offers, allTypesPoints }) {

  const { dateFrom, dateTo, offers: offersId, basePrice, destination, type } = state.point;

  if (state.point === POINT_EMPTY) {
    destinations = state.destination;
  }

  const destinationsList = createDestinationsList(destinations);

  if (destinations) {
    destinations = destinations.find((item) => item.id === destination);
  }

  const destinationPictures = createDestinationImg(destinations);

  offers = offers.find((offer) => offer.type === type);

  const offersList = createOfferItem(offers, offersId);

  const dateStartFormat = humanizePointDate(dateFrom, FULL_DATE_TIME_FORMAT);
  const dateEndFormat = humanizePointDate(dateTo, FULL_DATE_TIME_FORMAT);

  const typeList = createTypelist(allTypesPoints);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${typeList}
                </fieldset>
              </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations ? destinations.name : ''}" list="destination-list-1">
            ${destinations ? destinationsList : ''}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStartFormat}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEndFormat}" />
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          ${state.point === POINT_EMPTY ? '<button class="event__reset-btn" type="reset">Cancel</button>' : `
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button"><span class="visually-hidden" > Open event</span></button >
          ` }
        </header>
        <section class="event__details">
          ${offersList ? `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offersList}
            </div>
          </section>
          ` : ''}

          ${destinations ? `
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destinations.description ? destinations.description : ''}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${destinationPictures ? destinationPictures : ''}
              </div>
            </div>
          </section>
          ` : ''}

        </section>

      </form>
    </li>`
  );
}
export default class FormEditView extends AbstractStatefulView {
  #offers = null;
  #destinations = null;
  #handleFormSave = null;
  #handleFormClose = null;
  #allTypesPoints = null;
  #datePickerFrom = null;
  #datePickerTo = null;

  constructor({ point = POINT_EMPTY, offers, destinations, allTypesPoints, onSaveButtonClick, onResetButtonClick }) {
    super();
    this._setState(FormEditView.parsePointToState({ point }));

    this.#offers = offers;
    this.#destinations = destinations;
    this.#allTypesPoints = allTypesPoints;
    this.#handleFormSave = onSaveButtonClick;
    this.#handleFormClose = onResetButtonClick;

    this._restoreHandlers();
  }

  get template() {
    return createFormTemplate({
      state: this._state,
      destinations: this.#destinations,
      offers: this.#offers,
      allTypesPoints: this.#allTypesPoints
    });
  }

  removeElement() {
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSaveHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetClickHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.#setDatePickers();
  }

  #formSaveHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSave(FormEditView.parseStateToPoint(this._state));
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      }
    });
    this.#datePickerTo.set('minDate', this._state.point.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate,
      }
    });
    this.#datePickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: []
      }
    });
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };

  #offerChangeHandler = () => {
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => +element.dataset.id)
      }
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: +evt.target.value
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    const currentDestination = this.#destinations.find(({ name }) => evt.target.value === name);

    const currentDestinationId = (currentDestination) ? currentDestination.id : null;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: currentDestinationId
      }
    });
  };

  reset(point) {
    this.updateElement({ point });
  }

  #setDatePickers() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true
    };

    this.#datePickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.point.dateTo
      },
    );

    this.#datePickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.point.dateFrom
      },
    );
  }

  static parsePointToState({ point }) {
    return { point };
  }

  static parseStateToPoint(state) {
    console.log(state.point)
    return state.point;
  }
}
