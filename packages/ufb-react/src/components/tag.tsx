/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
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
