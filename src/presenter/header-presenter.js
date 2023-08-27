import { RenderPosition, render } from '../framework/render';
import FilterView from '../view/filters-view';
import InfoView from '../view/info-view';
import { generateFilter } from '../mock/filter-mock';

const tripMainEvents = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');

export default class HeaderPresenter {
  #pointsModel = null;
  #filters = null;

  constructor(pointsModel) {
    this.#pointsModel = pointsModel;
    this.#filters = generateFilter(this.#pointsModel.points);
  }

  init() {
    this.points = [...this.#pointsModel.points];

    if (this.points.length !== 0) {
      render(new InfoView(), tripMainEvents, RenderPosition.AFTERBEGIN);
    }

    render(new FilterView(this.#filters), tripFilters);
  }

}
