import type { Size } from "../types";
import { ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size;
}

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { size = "small", className } = props;

  return (
    <Icon
      name="spinner"
      size={ICON_SIZE[size]}
      className={cn("spinner", className)}
      aria-label="loading..."
    />
  );
};
export { Spinner };
