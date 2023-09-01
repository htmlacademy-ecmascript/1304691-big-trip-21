import { RenderPosition, render } from '../framework/render';
import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import NoPointsView from '../view/no-points-view';
import { OFFER_EMPTY } from '../const';
import PointPresenter from './point-presenter';

const tripEvents = document.querySelector('.trip-events');

export default class PointsPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsListComponent = new ListView();
  #sortComponent = new SortView();
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

  #renderPoints() {
    this.#points.forEach((point) => {
      const offersByType = this.#offersModel.getByType(point.type) ?? OFFER_EMPTY;
      const destination = this.#destinationsModel.getById(point.destination);
      this.#renderPoint(point, offersByType, destination);
    });
  }

  #renderPoint(point, offersByType, destination) {

    const pointPresenter = new PointPresenter({
      point,
      offersByType,
      destination,
      containerPoints: this.#pointsListComponent.element,
      allOffers: this.offers,
      allDestinations: this.destinations
    });

    pointPresenter.init();
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

  #renderSort() {
    render(this.#sortComponent, tripEvents, RenderPosition.AFTERBEGIN);
  }

}

