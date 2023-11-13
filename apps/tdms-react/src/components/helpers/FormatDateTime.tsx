import moment from 'moment';
import { curry } from 'lodash/fp';

enum Formats {
  dateTime = 'MM-DD-YYYY, h:mm:ss a',
  date = 'MM-DD-YYYY',
  dateMonth = 'DD-MMM-YYYY',
  monthDate = 'MMM-DD-YYYY',
}

const formatDateAs = curry((formatStr: Formats, dateTime: string) => moment(dateTime).utc().format(formatStr));

export const formatDateTime = formatDateAs(Formats.dateTime);
export const formatDate = formatDateAs(Formats.date);
export const formatDateMonth = formatDateAs(Formats.dateMonth);
export const formatMonthDate = formatDateAs(Formats.monthDate);

// should trap the "9999-12-31T23:59:59+00:00" invalid date from query issue, that date is a valid date just not realistic in our lifetimes
export function invalidDate(dateIn: string) {
  const now = moment();
  const thisDt = moment(dateIn);
  return !thisDt.isValid() || thisDt.isAfter(now, 'year');
}

export const formatValidDate = (dateTime: string | null | undefined) => {
  if (!dateTime || invalidDate(dateTime)) {
    return '';
  }
  return formatDate(dateTime);
};
