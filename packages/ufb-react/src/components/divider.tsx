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
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const dividerVariants = cva("divider", {
  variants: {
    variant: {
      bold: "divider-bold",
      subtle: "divider-subtle",
    },
    orientation: {
      horizontal: "divider-horizontal",
      vertical: "divider-vertical",
    },
    indent: {
      0: "",
      8: "",
      16: "",
      24: "",
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      indent: 8,
      className: "divider-horizontal-indent-8",
    },
    {
      orientation: "horizontal",
      indent: 16,
      className: "divider-horizontal-indent-16",
    },
    {
      orientation: "horizontal",
      indent: 24,
      className: "divider-horizontal-indent-24",
    },
    {
      orientation: "vertical",
      indent: 8,
      className: "divider-vertical-indent-8",
    },
    {
      orientation: "vertical",
      indent: 16,
      className: "divider-vertical-indent-16",
    },
    {
      orientation: "vertical",
      indent: 24,
      className: "divider-vertical-indent-24",
    },
  ],
  defaultVariants: {
    variant: "bold",
    orientation: "horizontal",
    indent: 0,
  },
});

interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  variant?: "bold" | "subtle";
  indent?: 0 | 8 | 16 | 24;
}

const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(
  (
    {
      variant = "bold",
      indent = 0,
      orientation = "horizontal",
      className,
      decorative = true,
      ...props
    },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        dividerVariants({ variant, orientation, indent, className }),
      )}
      {...props}
    />
  ),
);
Divider.displayName = SeparatorPrimitive.Root.displayName;

export { Divider };
