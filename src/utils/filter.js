import dayjs from 'dayjs';
import { FilterType } from '../const';

const Filters = {
  [FilterType.ALL]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(dayjs(point.dateFrom))),
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs().isAfter(dayjs(point.dateFrom)) && dayjs().isBefore(dayjs(point.dateTo))),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs().isAfter(dayjs(point.dateTo))),
};


export { Filters };
