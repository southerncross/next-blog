import { parseISO, format, isValid } from 'date-fns';

type Props = {
  date: string | Date;
  format?: string;
  className?: string;
};

const DateFormatter = ({
  date,
  format: _format = 'yyyy.MM.dd',
  className,
}: Props) => {
  const _date = typeof date === 'string' ? parseISO(date) : date;
  const valid = isValid(_date);
  const _dateString = valid
    ? typeof date === 'string'
      ? date
      : _date.toISOString()
    : undefined;
  return (
    <time className={className} dateTime={_dateString}>
      {valid ? format(_date, _format) : typeof date === 'string' ? date : ''}
    </time>
  );
};

export default DateFormatter;
