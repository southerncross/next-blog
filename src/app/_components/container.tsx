import clsx from 'clsx';

type Props = {
  children?: React.ReactNode;
  size?: 'narrow' | 'default' | 'wide';
  className?: string;
};

const Container = ({ children, size = 'default', className }: Props) => {
  return (
    <div
      className={clsx(
        'mx-auto w-full px-6 md:px-10',
        {
          'max-w-prose': size === 'narrow',
          'max-w-3xl': size === 'default',
          'max-w-content': size === 'wide',
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Container;
