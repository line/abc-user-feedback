import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { Radius, Size } from "../lib/types";
import { cn } from "../lib/utils";
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
  asChild?: boolean;
}

const Tag = React.forwardRef<HTMLElement, TagProps>((props, ref) => {
  const {
    variant = "primary",
    size,
    radius,
    className,
    children,
    asChild,
    ...rest
  } = props;

  const { themeSize, themeRadius } = useTheme();
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
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
      {children}
    </Comp>
  );
});

Tag.displayName = "Tag";

export { Tag, type TagProps };
