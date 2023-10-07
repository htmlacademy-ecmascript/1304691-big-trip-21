import { RenderPosition, render, remove } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import NoPointsView from '../view/no-points-view';
import LoadingMessageView from '../view/loading-view';
import PointPresenter from './point-presenter';
import { filter } from '../utils/filter';
import { SortType, enabledSortType, UpdateType, UserAction, FilterType, TimeLimit } from '../const';
import { sortPointsByTime, sortPointsByPrice, sortPointsByDay } from '../utils/common';
import NewPointPresenter from './new-point-presenter';

const tripEvents = document.querySelector('.trip-events');
export default class BoardPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #sortComponent = null;
  #pointsListComponent = new ListView();
  #noPointsComponent = null;
  #loadingComponent = new LoadingMessageView();

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  #isCreating = false;

  #tripEventsContainer = null;

  #blockNewPointButton = null;
  #unBlockNewPointButton = null;
  #isServerAvailable = true;

  constructor({ pointsModel, offersModel, destinationsModel, filterModel, blockNewPointButton, unBlockNewPointButton, tripEventsContainer }) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#tripEventsContainer = tripEventsContainer;
    this.#blockNewPointButton = blockNewPointButton;
    this.#unBlockNewPointButton = unBlockNewPointButton;

    this.#newPointPresenter = new NewPointPresenter({
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      pointsListContainer: this.#pointsListComponent.element,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#newPointDestroyHandler,
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

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.update(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.delete(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, update);
        } catch {
          this.#newPointPresenter.setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    const { isErorr } = data;
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard(isErorr);
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

  #renderLoading() {
    render(this.#loadingComponent, this.#tripEventsContainer);
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
    remove(this.#loadingComponent);
    this.#sortComponent = null;

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

  }

  #renderBoard(isError = false) {
    this.#isServerAvailable = Boolean(this.points);
    render(this.#pointsListComponent, tripEvents);

    if (this.#isLoading) {
      this.#renderLoading();
      this.#blockNewPointButton();
      return;
    }

    if (!this.#isServerAvailable || this.points.length === 0) {
      this.#unBlockNewPointButton();
      this.#renderNoPoints(isError);
      return;
    }

    if (!this.#isCreating) {
      this.#unBlockNewPointButton();
    }

    this.#renderSort();
    this.#renderPoints(this.points);
  }

  #renderNoPoints(isError) {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterType,
      isError
    });

    if (isError) {
      this.#blockNewPointButton();
    }

    render(this.#noPointsComponent, this.#pointsListComponent.element);
  }

  #newPointDestroyHandler = ({ isCanceled }) => {
    this.#isCreating = false;
    this.#unBlockNewPointButton();
    if (this.points.length === 0 && isCanceled) {
      remove(this.#sortComponent);
      this.#renderBoard();
    }
  };

}

