import dayjs from 'dayjs';
import { FILTER_TYPE } from '../const';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const currentDate = dayjs.utc().format();

const filter = {
  [FILTER_TYPE.ALL]: (points) => points,
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom).isSameOrAfter(currentDate)),
  [FILTER_TYPE.PRESENT]: (points) => points.filter((point) => dayjs(point.dateFrom).isSameOrBefore(currentDate, 'day') && dayjs(point.dateFrom).isSameOrAfter(currentDate, 'day')),
  [FILTER_TYPE.PAST]: (points) => points.filter((point) => dayjs(point.dateFrom).isSameOrBefore(currentDate)),
};

export { filter };
