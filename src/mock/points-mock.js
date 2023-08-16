import { getRandomArrayElement } from '../utils';

const points = [
  {
    'id': 0,
    'basePrice': 1100,
    'dateFrom': '2019-07-10T05:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': destination[1],
    'isFavorite': false,
    'offers': offer[1],
    'type': 'Taxi'
  },
  {
    'id': 1,
    'basePrice': 200,
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': destination[4],
    'isFavorite': true,
    'offers': offer[2],
    'type': 'Bus'
  },
  {
    'id': 2,
    'basePrice': 15,
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': destination[2],
    'isFavorite': true,
    'offers': offer[0],
    'type': 'Taxi'
  },
  {
    'id': 3,
    'basePrice': 5000,
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': destination[3],
    'isFavorite': false,
    'offers': offer[1],
    'type': 'Flight'
  },
  {
    'id': 4,
    'basePrice': 2,
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': destination[4],
    'isFavorite': true,
    'offers': offer[2],
    'type': 'Flight'
  },
];

function getRandomEvent() {
  return getRandomArrayElement(points);
}

export { getRandomEvent };

