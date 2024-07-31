import { cn } from "../lib/utils";
import { Icon } from "./icon";

type SpinnerSize = "large" | "small";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
}

const sizeMap: Record<SpinnerSize, string> = {
  large: "spinner-large",
  small: "spinner-small",
};

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { size = "large", className } = props;

  return (
    <Icon
      name="spinner"
      size={sizeMap[size]}
      className={cn("spinner", sizeMap[size], className)}
      aria-label="loading..."
    />
  );
};
export { Spinner };
