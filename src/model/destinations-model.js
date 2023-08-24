export default class DestinationsModel {
  constructor(service) {
    this.service = service;
    this.destinations = service.getDestinations();
  }

  get() {
    return this.destinations;
  }

  getById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }
}
