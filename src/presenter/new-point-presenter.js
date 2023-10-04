import { render, remove, RenderPosition } from '../framework/render';
import FormEditView from '../view/form-edit-view';
import { UserAction, UpdateType } from '../const';
import { isEscapeKey } from '../utils/common';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #formNewComponent = null;

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

    if (this.#formNewComponent !== null) {
      return;
    }

    this.#formNewComponent = new FormEditView({
      isNewPoint: true,
      offers: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,
      allTypesPoints: this.#allTypesPoints,
      onSaveButtonClick: this.#formSubmitHandler,
      onResetButtonClick: this.#resetClickHandler
    });

    render(this.#formNewComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escapeKeyDownHandler);
  }

  destroy({ isCanceled = true } = {}) {
    if (this.#formNewComponent === null) {
      return;
    }

    this.#handleDestroy({ isCanceled });

    remove(this.#formNewComponent);

    this.#formNewComponent = null;

    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
  }

  setSaving() {
  }

  setAborting() {
  }

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.destroy({ isCanceled: false });
  };

  #resetClickHandler = () => {
    this.destroy();
  };

  #escapeKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

}
