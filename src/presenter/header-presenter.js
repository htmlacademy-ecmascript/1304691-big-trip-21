import { RenderPosition, render } from '../framework/render';
import FilterView from '../view/filters-view';
import InfoView from '../view/info-view';
import { Filters } from '../utils/filter';

const tripMainEvents = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');

export default class HeaderPresenter {
  #points = null;
  #filterComponent = null;
  #filterModel = null;

  constructor(pointsModel, filterModel) {
    this.#points = pointsModel.points;
    this.#filterModel = filterModel;
  }

  init() {

    if (this.#points.length !== 0) {
      render(new InfoView(), tripMainEvents, RenderPosition.AFTERBEGIN);
    }

    this.#renderFilter();

  }

  #renderFilter() {
    const filterItems = this.#generateFilter(this.#points);

    this.#filterComponent = new FilterView({
      filterItems,
      onFilterTypeChange: () => {}
    });

    render(this.#filterComponent, tripFilters);
  }

  #generateFilter(points) {
    return Object.entries(Filters).map(
      ([filterType, filterPoints], index) => ({
        type: filterType,
        isChecked: index === 0,
        isDisabled: filterPoints(points).length === 0,
      }),
    );
  }

}
