import { createElement } from '../render';
import { FULL_DATE_TIME_FORMAT } from '../const';
import { humanizePointDate } from '../utils';
import { POINT_EMPTY } from '../const';

function createTypelist() {
  return `<div class="event__type-item">
    <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
      <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
  </div>`;
}

function createOfferItem(offersByType, offersId) {
  if (offersByType) {
    return offersByType.offers.map(({ title, price, id }) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${offersId.includes(id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
    </div>`
    ).join('');

  }
}

function createDestinationPoint(destinationId, destinations) {
  const destinationElement = destinations.find((destination) => destination.id === destinationId);
  return destinationElement;
}

function createDestinationImg(destinationId, destinations) {
  const currentDestination = createDestinationPoint(destinationId, destinations);

  return currentDestination.pictures.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}" />
  `).join('');
}

function createFormTemplate(point, offersByType, destinations) {
  const { dateFrom, dateTo, type, offers: offersId, destination: destinationId } = point;

  const dateStartFormat = humanizePointDate(dateFrom, FULL_DATE_TIME_FORMAT);
  const dateEndFormat = humanizePointDate(dateTo, FULL_DATE_TIME_FORMAT);

  const offersList = createOfferItem(offersByType, offersId);

  const pointDestination = createDestinationPoint(destinationId, destinations);

  const destinationPictures = createDestinationImg(destinationId, destinations);

  const typeList = createTypelist();

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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name ? pointDestination.name : ''}" list="destination-list-1">
              <datalist id="destination-list-1">
                <option value="Amsterdam"></option>
                <option value="Geneva"></option>
                <option value="Chamonix"></option>
              </datalist>
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${ offersList ? `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offersList}
            </div>
          </section>
          ` : ''}

          ${ destinationPictures || pointDestination.description ? `
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${pointDestination.description}</p>

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
export default class FormCreateView {
  constructor({ point = POINT_EMPTY, offers, destinations }) {
    this.point = point;
    this.offers = offers;
    this.destinations = destinations;
  }

  getTemplate() {
    return createFormTemplate(this.point, this.offers, this.destinations);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
