type Props = {
  name: string;
  picture: string;
  date?: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <img
        src={picture}
        className="h-9 w-9 rounded-full ring-1 ring-outline-subtle dark:ring-carbon-border"
        alt={name}
        width={36}
        height={36}
      />
      <span className="text-sm font-medium text-ink dark:text-carbon-text">
        {name}
      </span>
    </div>
  );
};

export default Avatar;
