import { formatDateToLocal } from "@/lib/utils";

type Props = {
  name: string;
  picture: string;
  date?: string;
};

const Avatar = ({ name, picture, date }: Props) => {
  return (
    <div className="flex items-center">
      <img
        src={picture}
        className="w-12 h-12 rounded-full mr-4"
        alt={name}
        width={48}
        height={48}
      />
      <div className="text-xl font-bold">{name}</div>
      {date && (
        <div className="text-xl font-light ml-4">{formatDateToLocal(date)}</div>
      )}
    </div>
  );
};

export default Avatar;
