import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';
import { capitalizeFirstLetter } from '../utils/common.js';

function createSortItem() {
  return Object.values(SortType).map((value) => `<div class="trip-sort__item  trip-sort__item--${value}">
    <input id="sort-${value}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${value}" checked>
        <label class="trip-sort__btn" for="sort-${value}">${capitalizeFirstLetter(value)}</label>
    </div>
  `).join('');
}

function createSortTemplate() {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${createSortItem()}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #onSortChange = null;

  constructor({ onSortChange }) {
    super();
    this.#onSortChange = onSortChange;

    this.element.addEventListener('click', this.#onSortTypeChange);
  }

  #onSortTypeChange = (evt) => {
    if (evt.target !== 'a') {
      return;
    }
    evt.preventDefault();
    this.#onSortChange();
  };

  get template() {
    return createSortTemplate();
  }
}
