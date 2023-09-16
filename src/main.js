import PointsPresenter from './presenter/board-presenter';
import HeaderPresenter from './presenter/header-presenter';

import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';

import Service from './service/service';

const service = new Service();

const pointsModel = new PointsModel(service);
const offersModel = new OffersModel(service);
const destinationsModel = new DestinationsModel(service);

const pointsPresenter = new PointsPresenter({pointsModel, offersModel, destinationsModel});

const headerPresenter = new HeaderPresenter(pointsModel);

pointsPresenter.init();
headerPresenter.init();


