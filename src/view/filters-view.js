import AbstractView from '../framework/view/abstract-view.js';

function createFilterItem({ type, isChecked, isDisabled }) {

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>
  `;
}

function createFilterTemplate(items) {

  const filterItemsTemplate = items
    .map((item) => createFilterItem(item))
    .join('');

  return `
  <div class="trip-main__trip-controls  trip-controls">
    <div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>
  </div>`;
}

export default class FiltersView extends AbstractView {
  #items = null;
  #handleFilterTypeChange = null;

  constructor({ filters, onFilterTypeChange }) {
    super();

    this.#items = filters;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#items);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
