import { createListPoints } from '../mock/points-mock';
import { POINTS_COUNT } from '../const';

export default class PointsModel {
  points = createListPoints(POINTS_COUNT);

  getPoints() {
    return this.points;
  }
}

//console.log(createListPoints(POINTS_COUNT));
