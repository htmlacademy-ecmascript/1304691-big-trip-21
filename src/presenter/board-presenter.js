import { RenderPosition, render, remove } from '../framework/render';
import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import NoPointsView from '../view/no-points-view';
import PointPresenter from './point-presenter';
import { filter } from '../utils/filter';
import { SortType, enabledSortType, UpdateType, UserAction, FilterType } from '../const';
import { sortPointsByTime, sortPointsByPrice, sortPointsByDay } from '../utils/common';
import NewPointPresenter from './new-point-presenter';

const tripEvents = document.querySelector('.trip-events');
export default class BoardPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #sortComponent = null;
  #pointsListComponent = new ListView();
  #noPointsComponent = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  #isCreating = false;

  #tripEventsContainer = null;

  #handleNewPointDestroy = null;

  constructor({ pointsModel, offersModel, destinationsModel, filterModel, onNewPointDestroy, tripEventsContainer }) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#tripEventsContainer = tripEventsContainer;
    this.#handleNewPointDestroy = onNewPointDestroy;

    this.#newPointPresenter = new NewPointPresenter({
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      pointsListContainer: this.#pointsListComponent.element,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#newPointDestroyHandler
    });

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#isCreating = true;

    this.#currentSortType = SortType.DEFAULT;

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);

    this.#newPointPresenter.init();

    if (this.points.length === 0) {
      this.#renderSort();
    }

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

  }

  get points() {

    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
      case SortType.DEFAULT:
        return filteredPoints.sort(sortPointsByDay);
    }

    return this.filteredPoints;
  }

  #viewActionHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        return this.#pointsModel.updatePoint(updateType, update);
      case UserAction.ADD_POINT:
        return this.#pointsModel.addPoint(updateType, update);
      case UserAction.DELETE_POINT:
        return this.#pointsModel.deletePoint(updateType, update);
    }
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        return this.#pointPresenters?.get(data.id)?.init(data);
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
    }
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #sortChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    const sortItems = this.#generateSort();

    this.#sortComponent = new SortView({
      sortItems: sortItems,
      onSortChange: this.#sortChangeHandler
    });

    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #generateSort() {
    return Object.values(SortType).map(
      (type) => ({
        type,
        isChecked: (type === this.#currentSortType),
        isDisabled: !enabledSortType[type]
      }),
    );
  }

  #renderPoints(points) {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {

    const pointPresenter = new PointPresenter(
      {
        containerPoints: this.#pointsListComponent.element,
        offersModel: this.#offersModel,
        destinationsModel: this.#destinationsModel,
        onPointChange: this.#viewActionHandler,
        onModeChange: this.#modeChangeHandler,
      }
    );

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearBoard({ resetSortType = false } = {}) {

    this.#newPointPresenter.destroy();

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);
    this.#sortComponent = null;

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

  }

  #renderBoard() {
    render(this.#pointsListComponent, tripEvents);

    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPoints(this.points);
  }

  #renderNoPoints() {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterType
    });

    render(this.#noPointsComponent, this.#pointsListComponent.element);
  }

  #newPointDestroyHandler = ({ isCanceled }) => {
    this.#isCreating = false;
    this.#handleNewPointDestroy();
    if (this.points.length === 0 && isCanceled) {
      remove(this.#sortComponent);
      this.#renderBoard();
    }
  };

}

