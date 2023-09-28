import { RenderPosition, render, remove } from '../framework/render';
import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import NoPointsView from '../view/no-points-view';
import PointPresenter from './point-presenter';
import { SortType, enabledSortType, UpdateType, UserAction } from '../const';
import { sortPointsByTime, sortPointsByPrice, sortPointsByDay } from '../utils/common';

const tripEvents = document.querySelector('.trip-events');
export default class BoardPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #sortComponent = null;

  #pointsListComponent = new ListView();
  #noPointsComponent = new NoPointsView();

  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor({ pointsModel, offersModel, destinationsModel }) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#renderBoard();
  }

  get points() {

    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortPointsByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPointsByPrice);
      case SortType.DEFAULT:
        return [...this.#pointsModel.points].sort(sortPointsByDay);
    }

    return this.#pointsModel.points;
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
        return this.#pointPresenters.get(data.id).init(data);
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

    render(this.#sortComponent, this.#pointsListComponent.element, RenderPosition.AFTERBEGIN);
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
        pointsModel: this.#pointsModel,
        onPointChange: this.#viewActionHandler,
        onModeChange: this.#modeChangeHandler,
      }
    );

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
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
    render(this.#noPointsComponent, this.#pointsListComponent.element);
  }

}

