import React from "react";
import * as remixIcons from "@remixicon/react";

import { cn } from "../lib/utils";

const customIcons = {
  spinner: "icon-spinner",
  temp: "icon-temp",
  "radio-circle": "icon-radio-circle",
  webhook: "icon-webhook",
  android: "icon-android",
  apple: "icon-apple",
  github: "icon-github",
  linkedin: "icon-linkedin",
  instagram: "icon-instagram",
  "text-format": "icon-text-format",
  "warning-triangle": "icon-warning-triangle",
} as const;
const Icons = { ...remixIcons, ...customIcons };
const IconNames = Object.keys(Icons) as (keyof typeof Icons)[];
type IconNameType = keyof typeof Icons;

interface IconProps {
  name?: IconNameType;
  color?: string;
  size?: number | string;
  className?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

const Icon: React.FC<IconProps> = ({
  name,
  color = "currentColor",
  size = 24,
  className,
  onClick,
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
    className: cn("icon", onClick && "icon-clickable", className),
    onClick,
    ...props,
  });
};

export { Icon, IconNames, type IconNameType, type IconProps };
