type Props = {
  name: string;
  picture: string;
  date?: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex flex-col items-center md:flex-row">
      <div className="flex items-center flex-row">
        <img
          src={picture}
          className="w-12 h-12 rounded-full mr-4"
          alt={name}
          width={48}
          height={48}
        />
        <span className="text-lg md:text-xl font-bold text-ellipsis overflow-hidden">
          {name}
        </span>
      </div>
    </div>
  );
};

export default Avatar;
