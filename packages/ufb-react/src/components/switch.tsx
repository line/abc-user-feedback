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
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";

import type { Color } from "../lib/types";
import { cn } from "../lib/utils";

const switchVariants = cva("switch", {
  variants: {
    color: {
      default: "switch-default",
      blue: "switch-blue",
      orange: "switch-orange",
      red: "switch-red",
      green: "switch-green",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  color?: Color;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ color, className, children, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ color }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={cn("switch-thumb")} />
    {children}
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
