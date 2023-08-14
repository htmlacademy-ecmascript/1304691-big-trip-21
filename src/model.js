import { getRandomEvent } from './mock/points-mock';

const EVENTS_COUNT = 4;

export default class EventsModel {
  events = Array.from({ length: EVENTS_COUNT }, getRandomEvent);

  getEvents() {
    return this.events;
  }
}
