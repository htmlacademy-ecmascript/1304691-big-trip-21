import PointsPresenter from './presenter/points-presenter';
import HeaderPresenter from './presenter/header-presenter';

import PointsModel from './model/points-model';

const pointsModel = new PointsModel();

const pointsPresenter = new PointsPresenter(pointsModel);

const headerPresenter = new HeaderPresenter(pointsModel);

pointsPresenter.init();
headerPresenter.init();


