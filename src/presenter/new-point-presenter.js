import { render, remove, RenderPosition } from '../framework/render';
import FormEditView from '../view/form-edit-view';
import { UserAction, UpdateType } from '../const';
import { isEscapeKey } from '../utils/common';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #formEditComponent = null;

  #offersModel = null;
  #allTypesPoints = null;
  #destinationsModel = null;

  constructor({ allTypesPoints, offersModel, destinationsModel, pointsListContainer, onDataChange, onDestroy }) {
    this.#allTypesPoints = allTypesPoints;
    this.#pointsListContainer = pointsListContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {

    if (this.#formEditComponent !== null) {
      return;
    }

    this.#formEditComponent = new FormEditView({
      isNewPoint: 'true',
      offers: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,
      allTypesPoints: this.#allTypesPoints,
      onSaveButtonClick: this.#formSubmitHandler,
      onResetButtonClick: this.#deleteClickHandler
    });

    render(this.#formEditComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escapeKeyDownHandler);
  }

  destroy() {
    if (this.#formEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#formEditComponent);

    this.#formEditComponent = null;

    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
  }

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { id: crypto.randomUUID(), ...point },
    );
    this.destroy();
  };

  #deleteClickHandler = () => {
    this.destroy();
  };

  #escapeKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

}
