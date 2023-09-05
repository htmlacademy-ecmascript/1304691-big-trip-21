import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';
import { capitalizeFirstLetter } from '../utils/common.js';

function createSortItem() {
  return Object.values(SortType).map((value) => `<div class="trip-sort__item  trip-sort__item--${value}">
    <input
    id="sort-${value}"
    class="trip-sort__input
    visually-hidden"
    type="radio"
    name="trip-sort"
    value="sort-${value}"
    ${value === SortType.EVENT || value === SortType.OFFER ? 'disabled' : ''}
    ${value === SortType.DEFAULT ? 'checked' : ''}
    >
      <label class="trip-sort__btn" for="sort-${value}" data-sort-type="${value}">${capitalizeFirstLetter(value)}</label>
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
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    evt.preventDefault();

    const currentTypeElement = evt.target;
    const currentTypeItemElement = currentTypeElement.closest('.trip-sort__item');
    const currentInput = currentTypeItemElement.querySelector('.trip-sort__input');

    this.#onSortChange(currentTypeElement.dataset.sortType);
    this.#setAttributeSort(currentInput);
  };

  #setAttributeSort(currentInput) {
    currentInput.removeAttribute('checked');
    if (currentInput.hasAttribute('checked') || currentInput.hasAttribute('disabled')) {
      return;
    }
    currentInput.setAttribute('checked', 'checked');
  }

  get template() {
    return createSortTemplate();
  }
}
