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
"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { Size } from "../lib/types";
import { CHECK_ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import useTheme from "./use-theme";

const defaultVariants: {
  size?: Size;
} = {
  size: undefined,
};

const checkboxVariants = cva("checkbox", {
  variants: {
    size: {
      small: "checkbox-small",
      medium: "checkbox-medium",
      large: "checkbox-large",
    },
  },
  defaultVariants,
});

const checkVariants = cva("check", {
  variants: {
    size: {
      small: "check-small",
      medium: "check-medium",
      large: "check-large",
    },
  },
  defaultVariants,
});

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  size?: Size;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ checked, size, children, className, onCheckedChange, ...props }, ref) => {
  const { themeSize } = useTheme();
  const [currentChecked, setCurrentChecked] =
    React.useState<CheckboxPrimitive.CheckedState>(false);

  const handleCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
    setCurrentChecked(checked);
    onCheckedChange?.(checked);
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxVariants({ size: size ?? themeSize, className }))}
      checked={checked ?? currentChecked}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <span className={cn(checkVariants({ size }))}>
        <CheckboxPrimitive.Indicator className={cn("checkbox-icon")}>
          <Icon
            name={
              (checked ?? currentChecked) === "indeterminate"
                ? "RiSubtractLine"
                : "RiCheckLine"
            }
            size={CHECK_ICON_SIZE[size ?? themeSize]}
          />
        </CheckboxPrimitive.Indicator>
      </span>
      <Slottable>{children}</Slottable>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, type CheckboxProps };
