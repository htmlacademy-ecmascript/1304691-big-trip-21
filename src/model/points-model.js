export default class PointsModel {
  #servise = null;
  #points = null;

  constructor(servise) {
    this.#servise = servise;
    this.#points = this.#servise.getPoints();
  }

  get points() {
    return this.#points;
  }
}
