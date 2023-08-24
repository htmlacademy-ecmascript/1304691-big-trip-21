const DATE_TIME_FORMAT = 'HH:mm';
const FULL_DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';
const DATE_MONTH_FORMAT = 'MMM D';

const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const DEFAULT_TYPE = 'Flight';

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

export {
  DATE_TIME_FORMAT,
  FULL_DATE_TIME_FORMAT,
  DATE_MONTH_FORMAT,
  POINT_TYPES,
  POINT_EMPTY,
  OFFER_EMPTY
};

