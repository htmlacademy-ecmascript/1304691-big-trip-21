import { render, replace, remove } from '../framework/render';
import PointView from '../view/point-view';
import FormEditView from '../view/form-edit-view';
import { OFFER_EMPTY } from '../const';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #containerPoints = null;
  #pointComponent = null;
  #formEditComponent = null;
  #onDataChange = null;
  #onModeChange = null;
  #point = null;
  #mode = Mode.DEFAULT;
  #offersModel = null;
  #destinationsModel = null;
  #pointsModel = null;
  #allTypesPoints = new Set();

  constructor({ containerPoints, offersModel, destinationsModel,onDataChange, pointsModel, onModeChange }) {
    this.#containerPoints = containerPoints;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
  }

  init(point) {

    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevFormEditComponent = this.#formEditComponent;

    this.#pointComponent = new PointView(
      {
        point: this.#point,
        offers: this.#offersModel.getByType(point.type) ?? OFFER_EMPTY,
        destination: this.#destinationsModel.getById(point.destination),
        onEditButtonClick: this.#onEditButtonClick,
        onFavoriteButtonClick: this.#onFavoriteButtonClick
      }
    );

    this.#formEditComponent = new FormEditView(
      {
        point: this.#point,
        offers: this.#offersModel.offers,
        destinations: this.#destinationsModel.destinations,
        allTypesPoints: this.#getTypesOfAllPoints(),
        onSaveButtonClick: this.#onSaveButtonClick
      }
    );

    if (prevPointComponent === null || prevFormEditComponent === null) {
      render(this.#pointComponent, this.#containerPoints);
      return;
    }

    if (this.#mode === 'DEFAULT') {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === 'EDITING') {
      replace(this.#formEditComponent, prevFormEditComponent);
    }

    remove(prevPointComponent);
    remove(prevFormEditComponent);

  }

  #getTypesOfAllPoints() {
    this.#pointsModel.points.forEach((points) => this.#allTypesPoints.add(points.type));
    return this.#allTypesPoints;
  }

  resetView() {
    if (this.#mode !== 'DEFAULT') {
      this.#formEditComponent.reset(this.#point);
      this.#replaceFormEditToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  }

  #replacePointToFormEdit() {
    replace(this.#formEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscapeKeyDown);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormEditToPoint() {
    replace(this.#pointComponent, this.#formEditComponent);
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
    this.#mode = Mode.DEFAULT;
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
      this.#formEditComponent.reset(this.#point);
      this.#replaceFormEditToPoint();
    }
  };

}
