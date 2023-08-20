import { RenderPosition, render } from '../render';
import FilterView from '../view/filters-view';
import InfoView from '../view/info-view';

const tripMainEvents = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');

export default class HeaderPresenter {

  constructor(pointsModel) {
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];
    render(new InfoView(), tripMainEvents, RenderPosition.AFTERBEGIN);

    render(new FilterView(), tripFilters);

  }

}
