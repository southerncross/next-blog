import classNames from 'classnames';

export default function Spinner({
  color = 'gray',
}: {
  color?: 'white' | 'gray';
}) {
  const textColor = color === 'white' ? 'text-white' : 'text-gray-600';
  return (
    <svg
      className={classNames('inline h-5 w-5 animate-spin', textColor)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
