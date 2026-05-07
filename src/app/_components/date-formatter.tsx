import { parseISO, format } from 'date-fns';

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
  const _dateString = typeof date === 'string' ? date : date.toISOString();
  return (
    <time className={className} dateTime={_dateString}>
      {format(_date, _format)}
    </time>
  );
};

export default DateFormatter;
