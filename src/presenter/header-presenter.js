import { render, remove, replace } from '../framework/render';
import FilterView from '../view/filters-view';
import { filter } from '../utils/filter';
import { UpdateType } from '../const';

export default class HeaderPresenter {
  #filterComponent = null;

  #pointsModel = null;
  #filterModel = null;

  #tripMainEventsContainer = null;

  constructor({ pointsModel, filterModel, tripMainEventsContainer }) {
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#tripMainEventsContainer = tripMainEventsContainer;

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  init() {
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
      render(this.#filterComponent, this.#tripMainEventsContainer);
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
