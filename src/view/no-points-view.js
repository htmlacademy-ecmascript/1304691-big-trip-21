import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const.js';

const NoPointsMessageType = {
  [FilterType.ALL]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

function createNoPointsMessage(filterType, isError) {
  const noPointsMessageValue = NoPointsMessageType[filterType];

  return isError ? (
    '<p class="trip-events__msg">Failed to load latest route information</p>') : `<p class="trip-events__msg">${noPointsMessageValue}</p>`;
}

export default class NoPointsView extends AbstractView {
  #filterType = null;
  #isError = null;

  constructor({ filterType, isError }) {
    super();
    this.#filterType = filterType;
    this.#isError = isError;
  }

  get template() {
    return createNoPointsMessage(this.#filterType, this.#isError);
  }
}
