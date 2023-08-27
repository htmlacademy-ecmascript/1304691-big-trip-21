import { render } from '../framework/render';
import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import PointView from '../view/point-view';
import FormEditView from '../view/form-edit-view';
import { OFFER_EMPTY } from '../const';

const tripEvents = document.querySelector('.trip-events');

export default class PointsPresenter {

  pointsListComponent = new ListView();

  constructor(pointsModel, offersModel, destinationsModel) {
    this.pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  init() {
    this.points = [...this.pointsModel.get()];
    this.offers = [...this.offersModel.get()];
    this.destinations = [...this.destinationsModel.get()];

    render(new SortView(), tripEvents);

    render(this.pointsListComponent, tripEvents);

    render(new FormEditView(
      {
        point: this.points[0],
        offers: this.offers,
        destinations: this.destinations
      }),
    this.pointsListComponent.element);

    for (let i = 0; i < this.points.length; i++) {

      render(new PointView(
        {
          point: this.points[i],
          offers: this.offersModel.getByType(this.points[i].type) ?? OFFER_EMPTY,
          destination: this.destinationsModel.getById(this.points[i].destination)
        }),
      this.pointsListComponent.element);

    }
  }

}

