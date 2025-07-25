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
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { CaptionType } from "../lib/types";
import type { IconNameType } from "./icon";
import { CAPTION_DEFAULT_ICON, ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import useTheme from "./use-theme";

const captionVariants = cva("caption", {
  variants: {
    variant: {
      default: "caption-default",
      success: "caption-success",
      info: "caption-info",
      error: "caption-error",
    },
    defaultVariants: { variant: "default" },
  },
});

interface CaptionProps extends React.ComponentPropsWithoutRef<"p"> {
  variant?: CaptionType;
  icon?: IconNameType;
  asChild?: boolean;
}

const Caption = React.forwardRef<HTMLParagraphElement, CaptionProps>(
  (props, ref) => {
    const {
      icon = undefined,
      variant,
      className,
      children,
      asChild,
      ...rest
    } = props;
    const Comp = asChild ? Slot : "p";
    const isError = variant === "error";
    const { themeSize } = useTheme();

    return (
      <Comp
        ref={ref}
        className={cn(
          captionVariants({ variant: variant ?? "default", className }),
        )}
        data-error={isError}
        {...rest}
      >
        <Icon
          name={
            icon ??
            CAPTION_DEFAULT_ICON[isError ? "error" : (variant ?? "default")]
          }
          size={ICON_SIZE[themeSize]}
          className="caption-icon"
        />
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);
Caption.displayName = "Caption";

export { Caption };
