import { render, replace, remove } from '../framework/render';
import PointView from '../view/point-view';
import FormEditView from '../view/form-edit-view';
import { OFFER_EMPTY, UserAction, UpdateType } from '../const';
import { isBigDifference, isEscapeKey } from '../utils/common';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};
export default class PointPresenter {
  #containerPoints = null;
  #pointComponent = null;
  #formEditComponent = null;
  #handlePointChange = null;
  #handleModeChange = null;
  #point = null;
  #mode = Mode.DEFAULT;
  #offersModel = null;
  #destinationsModel = null;

  constructor({ containerPoints, offersModel, destinationsModel, onPointChange, onModeChange }) {
    this.#containerPoints = containerPoints;
    this.#handlePointChange = onPointChange;
    this.#handleModeChange = onModeChange;
    this.#offersModel = offersModel;
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
        onEditButtonClick: this.#editButtonClickHandler,
        onFavoriteButtonClick: this.#favoriteButtonClickHandler
      }
    );

    this.#formEditComponent = new FormEditView(
      {
        point: this.#point,
        offers: this.#offersModel.offers,
        destinations: this.#destinationsModel.destinations,
        onSaveButtonClick: this.#saveButtonClickHandler,
        onResetButtonClick: this.#resetButtonClickHandler,
        onDeleteClick: this.#deleteButtonClickHandler
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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#formEditComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setDeleting() {
    this.#formEditComponent.updateElement({
      isDisabled: true,
      isDeleting: true
    });
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.pointComponent.shake();
    }

    if (this.#mode === Mode.EDITING) {
      const resetFormState = () => {
        this.#formEditComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        });
      };

      this.#formEditComponent.shake(resetFormState);
    }
  }

  #replacePointToFormEdit() {
    replace(this.#formEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escapeKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormEditToPoint() {
    replace(this.#pointComponent, this.#formEditComponent);
    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #editButtonClickHandler = () => {
    this.#replacePointToFormEdit();
  };

  #saveButtonClickHandler = (updatedPoint) => {

    const isMinorUpdate = isBigDifference(this.#point, updatedPoint);

    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      updatedPoint
    );

    this.#replaceFormEditToPoint();

  };

  #resetButtonClickHandler = () => {
    this.#formEditComponent.reset(this.#point);
    this.#replaceFormEditToPoint();
  };

  #favoriteButtonClickHandler = () => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite }
    );
  };

  #deleteButtonClickHandler = (point) => {
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #escapeKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#formEditComponent.reset(this.#point);
      this.#replaceFormEditToPoint();
    }
  };

}
