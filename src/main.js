import BoardPresenter from './presenter/board-presenter';
import HeaderPresenter from './presenter/header-presenter';

import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model.js';

import newPointButtonView from './view/new-point-button-view';

import Service from './service/service';

import PointsApiService  from './points-api-service';

const AUTHORISATION = 'Basic er883jdzbdw';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const tripMainEventsContainer = document.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');

const service = new Service({
  pointsApiService: new PointsApiService(END_POINT, AUTHORISATION)
});

const pointsModel = new PointsModel(service);
const offersModel = new OffersModel(service);
const destinationsModel = new DestinationsModel(service);
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
boardPresenter.init();


