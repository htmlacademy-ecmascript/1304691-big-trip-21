import { RenderPosition, render } from '../render';
import FilterView from '../view/filters-view';
import InfoView from '../view/info-view';

const tripMainEvents = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');

export default class HeaderPresenter {

  init() {
    render(new InfoView(), tripMainEvents, RenderPosition.AFTERBEGIN);
    render(new FilterView(), tripFilters);

  }

}
