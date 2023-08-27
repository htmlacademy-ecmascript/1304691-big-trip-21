import { render, replace } from '../framework/render';
import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import PointView from '../view/point-view';
import FormEditView from '../view/form-edit-view';
import { OFFER_EMPTY } from '../const';

const tripEvents = document.querySelector('.trip-events');

export default class PointsPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsListComponent = new ListView();
  #sortComponent = new SortView();

  constructor(pointsModel, offersModel, destinationsModel) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.points = [...this.#pointsModel.points];
    this.offers = [...this.#offersModel.offers];
    this.destinations = [...this.#destinationsModel.destinations];

    this.#renderListPoints();
  }

  #renderListPoints() {
    render(this.#sortComponent, tripEvents);
    render(this.#pointsListComponent, tripEvents);

    for (let i = 0; i < this.points.length; i++) {

      const point = this.points[i];
      const offers = this.#offersModel.getByType(this.points[i].type) ?? OFFER_EMPTY;
      const destination = this.#destinationsModel.getById(this.points[i].destination);

      this.#renderPoint(point, offers, destination);

    }
  }

  #renderPoint(point, offers, destination) {

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView(
      {
        point,
        offers,
        destination,
        onEditButtonClick: () => {
          replacePointToFormEdit();
          document.addEventListener('keydown', escKeyDownHandler);
        }
      }
    );

    const FormEditComponent = new FormEditView(
      {
        point: point,
        offers: this.offers,
        destinations: this.destinations,
        onSaveButtonClick: () => {
          replaceFormEditToPoint();
          document.removeEventListener('keydown', escKeyDownHandler);
        }
      }
    );

    function replacePointToFormEdit() {
      replace(FormEditComponent, pointComponent);
    }

    function replaceFormEditToPoint() {
      replace(pointComponent, FormEditComponent);
    }

    render(pointComponent, this.#pointsListComponent.element);

  }

}

