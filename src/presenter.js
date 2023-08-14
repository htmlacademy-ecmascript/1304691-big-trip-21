import { RenderPosition, render } from './render';
import FilterView from './view/filters';
import SortView from './view/sort';
import ListView from './view/list';
import PointView from './view/point';
import FormEditView from './view/form-edit';
import FormCreateView from './view/form-create';
import InfoView from './view/info';

const tripMainEvents = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripFilters = document.querySelector('.trip-controls__filters');
export default class EventsPresenter {

  eventsListComponent = new ListView();

  constructor(pointsModel) {
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getEvents()];

    render(new InfoView(), tripMainEvents, RenderPosition.AFTERBEGIN);
    render(new SortView(), tripEvents);
    render(new FilterView(), tripFilters);

    render(this.eventsListComponent, tripEvents);

    render(new FormCreateView({ point: this.points[0] }), this.eventsListComponent.getElement());

    for (let i = 1; i < this.points.length; i++) {
      render(new PointView({ point: this.points[i] }), this.eventsListComponent.getElement());
    }
    render(new FormEditView(), this.eventsListComponent.getElement());
  }

}

