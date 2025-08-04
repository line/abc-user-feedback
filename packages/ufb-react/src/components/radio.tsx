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

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";
import { Icon } from "./icon";

const radioGroupVariants = cva("radio-group", {
  variants: {
    orientation: {
      horizontal: "radio-group-horizontal",
      vertical: "radio-group-vertical",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ orientation, className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(radioGroupVariants({ orientation, className }))}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ children, className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn("radio-item", className)}
      {...props}
    >
      <span className="radio">
        <RadioGroupPrimitive.Indicator className="radio-indicator">
          <Icon name="RiCircleFill" size={6} />
        </RadioGroupPrimitive.Indicator>
      </span>
      <Slottable>{children}</Slottable>
    </RadioGroupPrimitive.Item>
  );
});
RadioItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioItem };
