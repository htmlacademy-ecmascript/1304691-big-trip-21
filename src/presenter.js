import { RenderPosition, render } from './render.js';
import FilterView from './view/filters.js';
import SortView from './view/sort.js';
import ListEvents from './view/list-events.js';
import ItemEvents from './view/item-events.js';
import FormEdit from './view/form-edit.js';
import FormCreate from './view/form-create.js';
import InfoEvents from './view/info.js';

const COUNT_WAY_POINT = 3;

const tripMainEvents = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripFilters = document.querySelector('.trip-controls__filters');

export default class EventsPresenter {

  eventsListComponent = new ListEvents();

  init() {
    render(new InfoEvents(), tripMainEvents, RenderPosition.AFTERBEGIN);
    render(new SortView(), tripEvents);
    render(new FilterView(), tripFilters);

    render(this.eventsListComponent, tripEvents);

    for (let i = 0; i < COUNT_WAY_POINT; i++) {
      render(new ItemEvents(), this.eventsListComponent.getElement());
    }

    render(new FormCreate(), this.eventsListComponent.getElement());
    render(new FormEdit(), this.eventsListComponent.getElement(), RenderPosition.AFTERBEGIN);
  }

}

