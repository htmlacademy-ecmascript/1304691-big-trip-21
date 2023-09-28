import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';
import { capitalizeFirstLetter } from '../utils/common.js';

function createSortItem({type, isChecked, isDisabled}) {

  return `<div class="trip-sort__item  trip-sort__item--${type}">
    <input
    id="sort-${type}"
    class="trip-sort__input
    visually-hidden"
    type="radio"
    name="trip-sort"
    value="sort-${type}"
    ${isDisabled ? 'disabled' : ''}
    ${isChecked ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${type}" data-sort-type="${type}">${capitalizeFirstLetter(type)}</label>
    </div>
  `;

}

function createSortTemplate(items) {

  const sortItemsTemplate = items
    .map((item) => createSortItem(item))
    .join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${sortItemsTemplate}</form>`
  );
}

export default class SortView extends AbstractView {
  #handleSortChange = null;
  #items = [];

  constructor({ sortItems, onSortChange }) {
    super();

    this.#items = sortItems;
    this.#handleSortChange = onSortChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    evt.preventDefault();

    const currentTypeElement = evt.target;

    if (currentTypeElement.dataset.sortType === SortType.EVENT || currentTypeElement.dataset.sortType === SortType.OFFER) {
      return;
    }

    this.#handleSortChange(currentTypeElement.dataset.sortType);
  };

  get template() {
    return createSortTemplate(this.#items);
  }
}
