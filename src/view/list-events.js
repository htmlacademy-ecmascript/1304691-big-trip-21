import { createElement } from '../render.js';

function createListTemplate() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class ListEvents {
  getTemplate() {
    return createListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
