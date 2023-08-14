import { getRandomArrayElement } from '../utils';

const offer = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': 0,
        'title': 'Upgrade to a business class',
        'price': 120
      },
      {
        'id': 1,
        'title': 'Add luggage',
        'price': 50
      },
      {
        'id': 2,
        'title': 'Add meal',
        'price': 15
      }
    ]
  },
  {
    'type': 'Bus',
    'offers': [
      {
        'id': 3,
        'title': 'Add meal',
        'price': 50
      },
    ]
  },
  {
    'type': 'Flight',
    'offers': [
      {
        'id': 4,
        'title': 'Add luggage',
        'price': 50
      },
      {
        'id': 5,
        'title': 'Add meal',
        'price': 15
      }
    ]
  }
];

const destination = [
  {
    'id': 0,
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Amsterdam',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random1',
        'description': 'Chamonix parliament building'
      },
      {
        'src': 'https://loremflickr.com/248/152?random10',
        'description': 'Chamonix parliament building'
      },
      {
        'src': 'https://loremflickr.com/248/152?random55',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 1,
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random2',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 2,
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Geneva',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random1',
        'description': 'Chamonix parliament building'
      },
      {
        'src': 'https://loremflickr.com/248/152?random10',
        'description': 'Chamonix parliament building'
      },
      {
        'src': 'https://loremflickr.com/248/152?random55',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 3,
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Rome',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random4',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 4,
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random1',
        'description': 'Chamonix parliament building'
      },
      {
        'src': 'https://loremflickr.com/248/152?random10',
        'description': 'Chamonix parliament building'
      },
      {
        'src': 'https://loremflickr.com/248/152?random55',
        'description': 'Chamonix parliament building'
      }
    ]
  }
];

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

