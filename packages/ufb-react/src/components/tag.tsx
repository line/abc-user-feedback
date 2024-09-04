import React from "react";
import { cva } from "class-variance-authority";

import type { Radius, Size } from "../lib/types";
import type { IconNameType } from "./icon";
import { SMALL_ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import useTheme from "./use-theme";

type TagVariant = "primary" | "secondary" | "outline" | "destructive";

const tagVariants = cva("tag", {
  variants: {
    variant: {
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
      variant: "primary",
      size: undefined,
      radius: undefined,
    },
  },
});

interface TagProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TagVariant;
  size?: Size;
  radius?: Radius;
  iconL?: IconNameType;
  iconR?: IconNameType;
  onClickIconL?: React.MouseEventHandler<SVGSVGElement>;
  onClickIconR?: React.MouseEventHandler<SVGSVGElement>;
}

const Tag = React.forwardRef<HTMLElement, TagProps>((props, ref) => {
  const {
    variant = "primary",
    size,
    radius,
    iconL,
    iconR,
    onClickIconL,
    onClickIconR,
    className,
    children,
    ...rest
  } = props;

  const { themeSize, themeRadius } = useTheme();

  return (
    <span
      {...rest}
      ref={ref}
      className={cn(
        tagVariants({
          variant,
          size: size ?? themeSize,
          radius: radius ?? themeRadius,
          className,
        }),
      )}
    >
      <React.Fragment>
        {iconL && (
          <Icon
            name={iconL}
            size={SMALL_ICON_SIZE[size ?? themeSize]}
            aria-hidden
            onClick={onClickIconL}
          />
        )}
        {children}
        {iconR && (
          <Icon
            name={iconR}
            size={SMALL_ICON_SIZE[size ?? themeSize]}
            aria-hidden
            onClick={onClickIconR}
          />
        )}
      </React.Fragment>
    </span>
  );
});

Tag.displayName = "Tag";

export { Tag, type TagProps };
