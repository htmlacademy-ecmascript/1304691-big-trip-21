import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const.js';

const NoPointsMessageType = {
  [FilterType.ALL]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

function createNoPointsMessage(filterType) {
  const noPointsMessageValue = NoPointsMessageType[filterType];

  return `<p class="trip-events__msg">${noPointsMessageValue}</p>`;
}

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsMessage(this.#filterType);
  }
}
