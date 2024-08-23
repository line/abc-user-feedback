import type { Size } from "../types";
import { ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import useTheme from "./use-theme";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size;
}

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { size, className } = props;
  const { themeSize } = useTheme();

  return (
    <Icon
      name="spinner"
      size={ICON_SIZE[size ?? themeSize]}
      className={cn("spinner", className)}
      aria-label="loading..."
    />
  );
};
export { Spinner };
