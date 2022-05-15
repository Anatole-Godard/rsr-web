import { classes } from "libs/classes";

export const Iframe = ({
  src,
  height,
  width,
  className,
}: {
  src: string;
  height: string | number;
  width: string | number;
  className?: string;
}) => {
  return (
    <div className={classes(className,)}>
      <iframe src={src} height={height} width={width} />
    </div>
  );
};
