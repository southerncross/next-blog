import classNames from "classnames";
import { formatDateToLocal } from "@/lib/utils";

type Props = {
  name: string;
  picture: string;
  date?: string;
};

const Avatar = ({ name, picture, date }: Props) => {
  return (
    <div className="flex flex-col items-center md:flex-row">
      <div
        className={classNames(
          "flex md:items-center flex-row",
          date ? "items-start" : "items-center"
        )}
      >
        <img
          src={picture}
          className="w-12 h-12 rounded-full mr-4"
          alt={name}
          width={48}
          height={48}
        />
        <div className="text-lg md:text-xl font-bold">{name}</div>
      </div>
      {date && (
        <div className="text-lg md:text-xl font-light ml-16 -mt-6 md:ml-4 md:mt-0">
          {formatDateToLocal(date)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
