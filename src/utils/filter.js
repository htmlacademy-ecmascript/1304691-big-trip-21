import dayjs from 'dayjs';
import { FilterType } from '../const';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const currentDate = dayjs.utc().format();

const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom).isSameOrAfter(currentDate)),
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs(point.dateFrom).isSameOrBefore(currentDate, 'day') && dayjs(point.dateTo).isSameOrAfter(currentDate, 'day')),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo).isSameOrBefore(currentDate)),
};

export { filter };
