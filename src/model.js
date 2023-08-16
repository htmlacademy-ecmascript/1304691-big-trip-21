import { getRandomEvent } from './mock/points-mock';
import { EVENTS_COUNT } from './const';
export default class EventsModel {
  events = Array.from({ length: EVENTS_COUNT }, getRandomEvent);

  getEvents() {
    return this.events;
  }
}
