import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { FULL_DATE_TIME_FORMAT } from '../const';
import { humanizePointDate, capitalizeFirstLetter, changeToLowerCase } from '../utils/common';
import { POINT_EMPTY } from '../const';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { encode } from 'he';

const ButtonLabel = {
  CANCEL_DEFAULT: 'Cancel',
  DELETE_DEFAULT: 'Delete',
  DELETE_IN_PROGRESS: 'Deleting...',
  SAVE_DEFAULT: 'Save',
  SAVE_IN_PROGRESS: 'Saving...'
};

function createTypelist(offers) {
  return offers.map(({ type }) => `<div class="event__type-item">
    <input id="event-type-${encode(type)}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${encode(type)}">
      <label class="event__type-label  event__type-label--${encode(type)}" for="event-type-${encode(type)}-1">${capitalizeFirstLetter(encode(type))}</label>
  </div>`).join('');
}

function createDestinationsList(destinations) {
  return `<datalist id="destination-list-1">${createDestinationsItems(destinations)}</datalist>`;
}

function createDestinationsItems(destinations) {
  return destinations.map((destination) => `<option value="${encode(destination.name)}"></option>`).join('');
}

function createOfferItem({ offersByType, offersId, isDisabled }) {
  return offersByType.offers.map(({ title, price, id }) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${encode(changeToLowerCase(title))}-1" data-id="${id}" type="checkbox" name="event-offer-${encode(changeToLowerCase(title))}" ${offersId.includes(id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${encode(changeToLowerCase(title))}-1">
          <span class="event__offer-title">${encode(title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${encode(String(price))}</span>
        </label>
    </div>`
  ).join('');
}

function createDestinationImgList(destinationItem) {
  return destinationItem.pictures.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}" />
  `).join('');
}
function createDestinationImgContainer(destinationItem) {
  return `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${createDestinationImgList(destinationItem)}
      </div>
    </div>`;
}

function createDeleteButtonTemplate({ isNewPoint, isDeleting, isDisabled }) {
  let label;

  if (isNewPoint) {
    label = ButtonLabel.CANCEL_DEFAULT;
  } else {
    label = isDeleting ? ButtonLabel.DELETE_IN_PROGRESS : ButtonLabel.DELETE_DEFAULT;
  }

  return `<button class="event__reset-btn" type="reset"${isDisabled ? 'disabled' : ''}>${label}</button>`;
}

function createRollupButtonTemplate(isDisabled) {
  return `<button class="event__rollup-btn" type="button"><span class="visually-hidden" ${isDisabled ? 'disabled' : ''}> Open event</span></button>`;
}

function createSaveButtonTemplate({ isSaving, isDisabled }) {
  const label = isSaving ? ButtonLabel.SAVE_IN_PROGRESS : ButtonLabel.SAVE_DEFAULT;

  return `<button class="event__save-btn btn btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${label}</button>`;
}

function createDestinationTemplate(destinationItem, destinationPictures) {
  if (destinationItem.description || destinationPictures.length !== 0) {
    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destinationItem.description ? encode(destinationItem.description) : ''}</p>
    ${destinationPictures.length !== 0 ? createDestinationImgContainer(destinationItem) : ''}
  </section>`;
  }

  return '';
}

function createFormTemplate({ isNewPoint, state, destinations, offers }) {

  const { point, isSaving, isDeleting, isDisabled } = state;

  const { dateFrom, dateTo, offers: offersId, basePrice, destination, type } = point;

  const destinationsList = createDestinationsList(destinations);

  const destinationItem = destinations.find((item) => item.id === destination);

  const offersByType = offers.find((offer) => offer.type === type);

  let offersList = '';

  if (offersByType) {
    offersList = createOfferItem({ offersByType, offersId, isDisabled });
  }

  const dateStartFormat = humanizePointDate(dateFrom, FULL_DATE_TIME_FORMAT);
  const dateEndFormat = humanizePointDate(dateTo, FULL_DATE_TIME_FORMAT);

  const typeList = createTypelist(offers);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${encode(type)}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox" ${isSaving || isDeleting ? ' disabled' : ''}>

              <div class="event__type-list">
                <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
                  <legend class="visually-hidden">Event type</legend>
                  ${typeList}
                </fieldset>
              </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${encode(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationItem ? encode(destinationItem.name) : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            ${destinationsList}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStartFormat}" ${isDisabled ? 'disabled' : ''} />
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEndFormat}" ${isDisabled ? 'disabled' : ''} />
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${encode(String(basePrice))}" ${isDisabled ? 'disabled' : ''}>
          </div>

          ${createSaveButtonTemplate({ isSaving, isDisabled })}
          ${createDeleteButtonTemplate({ isNewPoint, isDeleting, isDisabled })}
          ${isNewPoint ? '' : createRollupButtonTemplate(isDisabled)}
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
          ${destinationItem ? createDestinationTemplate(destinationItem, destinationItem.pictures) : ''}
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
  #datePickerFrom = null;
  #datePickerTo = null;
  #handleDeleteClick = null;
  #isNewPoint = null;

  constructor({ isNewPoint = false, point = POINT_EMPTY, offers, destinations, onSaveButtonClick, onResetButtonClick, onDeleteClick }) {
    super();

    this.#isNewPoint = isNewPoint;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSave = onSaveButtonClick;
    this.#handleFormClose = onResetButtonClick;
    this.#handleDeleteClick = onDeleteClick;

    this._setState(FormEditView.parsePointToState({ point }));

    this._restoreHandlers();
  }

  get template() {
    return createFormTemplate({
      isNewPoint: this.#isNewPoint,
      state: this._state,
      destinations: this.#destinations,
      offers: this.#offers,
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
    if (this.#isNewPoint === false) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#resetClickHandler);

      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#formDeleteClickHandler);
    }

    if (this.#isNewPoint) {
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#resetClickHandler);
    }

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSaveHandler);

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

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();

    this.#handleDeleteClick(FormEditView.parseStateToPoint(this._state));
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
        offers: checkedBoxes.map((element) => element.dataset.id)
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

  static parsePointToState({ point, isDisabled = false, isSaving = false, isDeleting = false }) {
    return {
      point,
      isDisabled,
      isSaving,
      isDeleting
    };
  }

  static parseStateToPoint(state) {
    return state.point;
  }
}
