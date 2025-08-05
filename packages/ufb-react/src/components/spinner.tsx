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

import { cva } from "class-variance-authority";

import type { Size } from "../types";
import { cn } from "../lib/utils";
import useTheme from "./use-theme";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size;
}

const defaultVariants: {
  size?: Size;
} = {
  size: undefined,
};

const spinnerVariants = cva("spinner", {
  variants: {
    size: {
      small: "spinner-small",
      medium: "spinner-medium",
      large: "spinner-large",
    },
  },
  defaultVariants,
});

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { size, className } = props;
  const { themeSize } = useTheme();

  return (
    <span
      className={cn(spinnerVariants({ size: size ?? themeSize }), className)}
      aria-label="loading..."
    ></span>
  );
};
export { Spinner };
