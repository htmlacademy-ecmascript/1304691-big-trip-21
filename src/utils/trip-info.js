import dayjs from 'dayjs';
import { DESTINATIONS_ITEMS_LENGTH } from '../const';
import { sortPointsByDay } from '../utils/common';

function getTripTitle(points = [], destinations = []) {
  const destinationNames = points.sort(sortPointsByDay)
    .map((point) => destinations.find((destination) => destination.id === point.destination).name);

  return destinationNames.length <= DESTINATIONS_ITEMS_LENGTH ? destinationNames.join('&nbsp;&mdash;&nbsp;') : `${destinationNames.at(0)}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${destinationNames.at(-1)}`;
}

function getTripDuration(points = []) {
  const sortedPoints = points.sort(sortPointsByDay);
  return (sortedPoints.length > 0) ? `${dayjs(sortedPoints.at(0).dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(sortedPoints.at(-1).dateTo).format('DD MMM')}` : '';
}

function getOffersCost(offersIds = [], offers = []) {
  return offersIds.reduce(
    (result, id) => result + (offers.find((offer) => offer.id === id)?.price ?? 0),
    0);
}

function getTripCost(points = [], offers = []) {
  return points.reduce(
    (result, point) => result + point.basePrice + getOffersCost(point.offers, offers.find((offer) => point.type === offer.type)?.offers),
    0);
}

export {
  getTripTitle,
  getTripDuration,
  getTripCost
};
