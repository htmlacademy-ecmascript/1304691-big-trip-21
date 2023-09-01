import { render, replace, remove } from '../framework/render';
import PointView from '../view/point-view';
import FormEditView from '../view/form-edit-view';

export default class PointPresenter {
  #point = null;
  #offersByType = null;
  #destination = null;
  #containerPoints = null;
  #allOffers = null;
  #allDestinations = null;

  #pointComponent = null;
  #formEditComponent = null;

  constructor({ point, offersByType, destination, containerPoints, allOffers, allDestinations }) {
    this.#point = point;
    this.#offersByType = offersByType;
    this.#destination = destination;
    this.#containerPoints = containerPoints;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
  }

  init() {

    const prevPointComponent = this.#pointComponent;
    const prevFormEditComponent = this.#formEditComponent;

    this.#pointComponent = new PointView(
      {
        point: this.#point,
        offers: this.#offersByType,
        destination: this.#destination,
        onEditButtonClick: this.#onEditButtonClick
      }
    );

    this.#formEditComponent = new FormEditView(
      {
        point: this.#point,
        offers: this.#allOffers,
        destinations: this.#allDestinations,
        onSaveButtonClick: this.#onSaveButtonClick
      }
    );

    if (prevPointComponent === null || prevFormEditComponent === null) {
      render(this.#pointComponent, this.#containerPoints);
      return;
    }

    if (this.#containerPoints.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#containerPoints.contains(prevFormEditComponent.element)) {
      replace(this.#formEditComponent, prevFormEditComponent);
    }

    remove(prevPointComponent);
    remove(prevFormEditComponent);

  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  }

  #replacePointToFormEdit() {
    replace(this.#formEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscapeKeyDown);
  }

  #replaceFormEditToPoint() {
    replace(this.#pointComponent, this.#formEditComponent);
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  }

  #onEditButtonClick = () => {
    this.#replacePointToFormEdit();
  };

  #onSaveButtonClick = () => {
    this.#replaceFormEditToPoint();
  };

  #onEscapeKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormEditToPoint();
    }
  };

}
