import { RenderPosition, render, remove, replace } from '../framework/render';
import FilterView from '../view/filters-view';
import InfoView from '../view/info-view';
import { filter } from '../utils/filter';
import { UpdateType } from '../const';

const tripMainEvents = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');

export default class HeaderPresenter {
  #filterComponent = null;

  #pointsModel = null;
  #filterModel = null;

  constructor(pointsModel, filterModel) {
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  init() {

    if (this.#pointsModel.points.length !== 0) {
      render(new InfoView(), tripMainEvents, RenderPosition.AFTERBEGIN);
    }

    this.#initFilter();

  }

  #initFilter() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      onFilterTypeChange: this.#filterTypeChangeHandler
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, tripFilters);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);

    remove(prevFilterComponent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.entries(filter).map(
      ([filterType, filterPoints]) => ({
        type: filterType,
        isChecked: filterType === this.#filterModel.filter,
        isDisabled: filterPoints(points).length === 0,
      }),
    );
  }

  #modelEventHandler = () => {
    this.#initFilter();
  };


  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

}
