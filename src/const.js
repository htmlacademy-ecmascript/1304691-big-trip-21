const DATE_TIME_FORMAT = 'HH:mm';
const FULL_DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';
const DATE_MONTH_FORMAT = 'MMM D';

const DEFAULT_TYPE = 'flight';

const OFFER_EMPTY = {
  type: DEFAULT_TYPE,
  offers: []
};

const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const FilterType = {
  ALL: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past',
};

const SortType = {
  DEFAULT: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const enabledSortType = {
  [SortType.DEFAULT]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFER]: false,
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const DESTINATIONS_ITEMS_LENGTH = 3;

export {
  DATE_TIME_FORMAT,
  FULL_DATE_TIME_FORMAT,
  DATE_MONTH_FORMAT,
  POINT_EMPTY,
  OFFER_EMPTY,
  FilterType,
  SortType,
  enabledSortType,
  UserAction,
  UpdateType,
  Method,
  TimeLimit,
  DESTINATIONS_ITEMS_LENGTH
};

