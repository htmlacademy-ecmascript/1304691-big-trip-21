import EventsPresenter from './presenter';
import EventsModel from './model';

const eventsModel = new EventsModel();
const eventsPresenter = new EventsPresenter(eventsModel);

eventsPresenter.init();


