import { RenderPosition, render } from '../framework/render';
import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import NoPointsView from '../view/no-points-view';
import { OFFER_EMPTY } from '../const';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils/common';

const tripEvents = document.querySelector('.trip-events');

export default class PointsPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsListComponent = new ListView();
  #sortComponent = null;
  #noPointsComponent = new NoPointsView();

  #points = [];
  #pointPresenters = new Map();

  constructor(pointsModel, offersModel, destinationsModel) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.offers = [...this.#offersModel.offers];
    this.destinations = [...this.#destinationsModel.destinations];

    this.#renderPointsList();
  }

  #onPointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(
      {
        point: updatedPoint,
        offersByType: this.#offersModel.getByType(updatedPoint.type) ?? OFFER_EMPTY,
        destination: this.#destinationsModel.getById(updatedPoint.destination),
        allOffers: this.offers,
        allDestinations: this.destinations
      }
    );
  };

  #onModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #onSortChange = (sortType) => {
  // - Сортируем точки
    // - Очищаем список
    // - Рендерим список заново
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortChange: this.#onSortChange
    });
  }

  #renderPoints() {
    this.#points.forEach((point) => {

      const offersByType = this.#offersModel.getByType(point.type) ?? OFFER_EMPTY;
      const destination = this.#destinationsModel.getById(point.destination);

      this.#renderPoint(point, offersByType, destination);
    });
  }

  #renderPoint(point, offersByType, destination) {

    const pointPresenter = new PointPresenter(
      {
        containerPoints: this.#pointsListComponent.element,
        onDataChange: this.#onPointChange,
        onModeChange: this.#onModeChange
      }
    );

    pointPresenter.init(
      {
        point,
        offersByType,
        destination,
        allOffers: this.offers,
        allDestinations: this.destinations
      }
    );
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPointsList() {
    render(this.#pointsListComponent, tripEvents);

    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#pointsListComponent.element);
  }

}

