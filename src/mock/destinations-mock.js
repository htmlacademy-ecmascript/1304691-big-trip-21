import { getRandomArrayElement, getRandomInteger } from '../utils';

const CITY_NAMES = ['Chamonix', 'Geneva', 'Amsterdam', 'Rome', ' 	Barcelona', ' Valencia', 'Jerusalem', 'Kyoto'];

const DESTINATIONS_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'Aliquam tellus quam, ornare in felis vel, auctor volutpat eros',
  'Cras non auctor elit.Curabitur eu eros quis metus auctor sollicitudin tincidunt id mauris',
  'In tellus ex, sagittis eget iaculis id, consectetur et leo.Etiam convallis orci eu sem convallis lacinia',
  'Suspendisse imperdiet a odio nec ultrices.Donec dapibus, elit vel mattis cursus, purus tellus sollicitudin velit, at hendrerit risus ligula sit amet leo',
  'Ut et libero dapibus sem dictum vehicula.Phasellus egestas metus facilisis quam imperdiet vestibulum.Maecenas nec malesuada elit.',
  'Nunc blandit justo sit amet elit pellentesque sagittis in gravida ligula'
];

const MIN_PICTURES = 0;
const MAX_PICTURES = 6;

function createPicture() {
  return {
    src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 100)}`,
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS)
  };
}

function createDestination(index) {
  return {
    id: index,
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    name: getRandomArrayElement(CITY_NAMES),
    pictures: Array.from({ length: getRandomInteger(MIN_PICTURES, MAX_PICTURES)}, createPicture)
  };
}

export { createDestination };
