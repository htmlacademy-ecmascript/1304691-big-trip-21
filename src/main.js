import BoardPresenter from './presenter/board-presenter';
import HeaderPresenter from './presenter/header-presenter';

import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model.js';

import newPointButtonView from './view/new-point-button-view';

import ApiService from './api-service';

const AUTHORIZATION = 'Basic er883jdzbdw';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const tripMainEventsContainer = document.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');

const service = new ApiService(END_POINT, AUTHORIZATION);
const offersModel = new OffersModel(service);
const destinationsModel = new DestinationsModel(service);
const pointsModel = new PointsModel({ service, offersModel, destinationsModel });
const filterModel = new FilterModel();

const newPointButtonComponent = new newPointButtonView({
  onClick: newButtonClickHandler
});

const boardPresenter = new BoardPresenter({ pointsModel, offersModel, destinationsModel, filterModel, onNewPointDestroy: newPointFormCloseHandler, tripEventsContainer, newPointButtonComponent });

const headerPresenter = new HeaderPresenter({ pointsModel, filterModel, offersModel, destinationsModel, tripMainEventsContainer, newPointButtonComponent });

function newPointFormCloseHandler() {
  newPointButtonComponent.element.disabled = false;
}

function newButtonClickHandler() {
  newPointButtonComponent.element.disabled = true;
  boardPresenter.createPoint();
}

headerPresenter.init();
pointsModel.init()
  .finally(() => {
    headerPresenter.renderNewPointButton();
  });


