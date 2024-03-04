type Props = {
  name: string;
  picture: string;
  date?: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex flex-col items-center md:flex-row">
      <div className="flex flex-row items-center">
        <img
          src={picture}
          className="mr-4 h-12 w-12 rounded-full"
          alt={name}
          width={48}
          height={48}
        />
        <span className="overflow-hidden text-ellipsis text-lg font-bold md:text-xl">
          {name}
        </span>
      </div>
    </div>
  );
};

export default Avatar;
