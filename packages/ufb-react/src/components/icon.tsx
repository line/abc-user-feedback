import React from "react";
import * as remixIcons from "@remixicon/react";

import { cn } from "../lib/utils";

const customIcons = {
  spinner: "icon-spinner",
  temp: "icon-temp",
} as const;
const Icons = { ...remixIcons, ...customIcons };
const IconNames = Object.keys(Icons) as (keyof typeof Icons)[];
type IconNameType = keyof typeof Icons;

interface IconProps {
  name: IconNameType | null;
  color?: string;
  size?: number | string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  color = "currentColor",
  size = 24,
  className,
  ...props
}) => {
  if (!name) {
    return <></>;
  }

  if (Object.keys(customIcons).includes(name)) {
    return React.createElement("span", {
      style: { width: size, height: size, backgroundColor: color },
      className: cn("icon", Icons[name], className),
    });
  }

  return React.createElement(Icons[name], {
    color,
    size,
    className: cn("icon", className),
    ...props,
  });
};

export { Icon, IconNames, type IconNameType, type IconProps };
