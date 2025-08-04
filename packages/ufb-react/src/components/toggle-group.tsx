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

import type * as TogglePrimitive from "@radix-ui/react-toggle";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";

import type { Radius, Size } from "../lib/types";
import { cn } from "../lib/utils";
import useTheme from "./use-theme";

const toggleVariants = cva("toggle-group-item", {
  variants: {
    size: {
      small: "toggle-group-item-small",
      medium: "toggle-group-item-medium",
      large: "toggle-group-item-large",
    },
    radius: {
      small: "toggle-group-item-radius-small",
      medium: "toggle-group-item-radius-medium",
      large: "toggle-group-item-radius-large",
    },
  },
  defaultVariants: {
    size: undefined,
    radius: undefined,
  },
});

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: undefined,
  radius: undefined,
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, size, radius, children, ...props }, ref) => {
  const { themeSize, themeRadius } = useTheme();

  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn("toggle-group", className)}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ size: size ?? themeSize, radius: radius ?? themeRadius }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    Omit<VariantProps<typeof toggleVariants>, "disabled"> {
  size?: Size;
  radius?: Radius;
  value: string;
}

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, children, size, radius, disabled, value, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          size: size ?? context.size,
          radius: radius ?? context.radius,
        }),
        className,
      )}
      value={value}
      disabled={disabled}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
