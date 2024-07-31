import React from "react";
import { cva } from "class-variance-authority";

import type { Radius, Size } from "../lib/types";
import type { IconNameType } from "./icon";
import { SMALL_ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

type TagType = "primary" | "secondary" | "outline" | "destructive";

const tagVariants = cva("tag", {
  variants: {
    type: {
      primary: "tag-primary",
      secondary: "tag-secondary",
      outline: "tag-outline",
      destructive: "tag-destructive",
    },
    size: {
      large: "tag-large",
      medium: "tag-medium",
      small: "tag-small",
    },
    radius: {
      large: "tag-radius-large",
      medium: "tag-radius-medium",
      small: "tag-radius-small",
    },
    defaultVariants: {
      type: "primary",
      size: "small",
      radius: "medium",
    },
  },
});

interface TagProps extends React.HTMLAttributes<HTMLElement> {
  type?: TagType;
  size?: Size;
  radius?: Radius;
  icon?: IconNameType;
}

const Tag = React.forwardRef<HTMLElement, TagProps>((props, ref) => {
  const {
    type = "primary",
    size = "small",
    radius = "medium",
    icon,
    onClick,
    children,
    ...rest
  } = props;

  return (
    <span
      {...rest}
      ref={ref}
      className={cn(tagVariants({ type, size, radius }))}
    >
      {icon && <Icon name={icon} size={SMALL_ICON_SIZE[size]} aria-hidden />}
      {children}
      <button
        type="button"
        aria-label="Remove this tag"
        className="tag-button"
        onClick={onClick}
      >
        <Icon
          name="RiCloseLargeLine"
          size={SMALL_ICON_SIZE[size]}
          aria-hidden
        />
      </button>
    </span>
  );
});

Tag.displayName = "Tag";

export { Tag, type TagProps };
