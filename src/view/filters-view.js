import AbstractView from '../framework/view/abstract-view.js';


function createFilterItem({ type, isChecked, isDisabled }) {

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;
}

function createFilterTemplate(items) {

  const filterItemsTemplate = items
    .map((item) => createFilterItem(item))
    .join('');

  return `<form class="trip-filters" action="#" method="get">${filterItemsTemplate}</form>
  <button class="visually-hidden" type="submit">Accept filter</button>`;

}

export default class FiltersView extends AbstractView {
  #items = null;

  constructor({ filterItems }) {
    super();

    this.#items = filterItems;
  }

  get template() {
    return createFilterTemplate(this.#items);
  }
}
