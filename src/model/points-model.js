import Observable from '../framework/observable.js';
export default class PointsModel extends Observable {
  #servise = null;
  #points = null;

  constructor(servise) {
    super();
    this.#servise = servise;
    this.#points = this.#servise.getPoints();
  }

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType);
  }

}
