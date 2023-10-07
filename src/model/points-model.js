import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';
import { updateItem, adaptToServer, adaptToClient } from '../utils/common.js';

export default class PointsModel extends Observable {
  #service = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];

  constructor({ service, offersModel, destinationsModel }) {
    super();

    this.#service = service;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const points = await this.#service.getPoints();
      this.#points = points.map(adaptToClient);
      this._notify(UpdateType.INIT, { isErorr: false });
    } catch (err) {
      this.#points = [];
      this._notify(UpdateType.INIT, { isErorr: true });
    }
  }

  get points() {
    return this.#points;
  }

  async update(updateType, point) {
    try {
      const updatedPoint = await this.#service.updatePoint(adaptToServer(point));
      const adaptedPoint = adaptToClient(updatedPoint);
      this.#points = updateItem(this.#points, adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch {
      throw new Error('Can\'t update point');
    }
  }

  async add(updateType, point) {
    try {
      const adeddPoint = await this.#service.addPoint(adaptToServer(point));
      const adaptedPoint = adaptToClient(adeddPoint);
      this.#points.push(adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch {
      throw new Error('Can\'t add point');
    }
  }

  async delete(updateType, point) {
    try {
      await this.#service.deletePoint(point);
      this.#points = this.#points.filter((pointItem) => pointItem.id !== point.id);
      this._notify(updateType, { isErorr: false });
    } catch {
      throw new Error('Can\'t delete point');
    }
  }

}
