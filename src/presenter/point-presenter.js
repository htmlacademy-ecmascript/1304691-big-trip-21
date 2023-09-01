import { render, replace, remove } from '../framework/render';
import PointView from '../view/point-view';
import FormEditView from '../view/form-edit-view';

export default class PointPresenter {
  #containerPoints = null;
  #pointComponent = null;
  #formEditComponent = null;
  #onDataChange = null;
  #point = null;

  constructor({ containerPoints, onDataChange }) {
    this.#containerPoints = containerPoints;
    this.#onDataChange = onDataChange;
  }

  init({ point, offersByType, destination, allOffers, allDestinations }) {

    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevFormEditComponent = this.#formEditComponent;

    this.#pointComponent = new PointView(
      {
        point: this.#point,
        offers: offersByType,
        destination: destination,
        onEditButtonClick: this.#onEditButtonClick,
        onFavoriteButtonClick: this.#onFavoriteButtonClick
      }
    );

    this.#formEditComponent = new FormEditView(
      {
        point: this.#point,
        offers: allOffers,
        destinations: allDestinations,
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

  #onFavoriteButtonClick = () => {
    this.#onDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #onEscapeKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormEditToPoint();
    }
  };

}
