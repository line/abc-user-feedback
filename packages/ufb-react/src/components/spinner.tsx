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
import type { Size } from "../types";
import { ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import useTheme from "./use-theme";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size;
}

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { size, className } = props;
  const { themeSize } = useTheme();

  return (
    <Icon
      name="spinner"
      size={ICON_SIZE[size ?? themeSize]}
      className={cn("spinner", className)}
      aria-label="loading..."
    />
  );
};
export { Spinner };
