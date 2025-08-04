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
import * as remixIcons from "@remixicon/react";

import { cn } from "../lib/utils";

const Icons = remixIcons;
const IconNames = Object.keys(Icons) as (keyof typeof Icons)[];
type IconNameType = keyof typeof Icons;

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "children"> {
  name?: IconNameType;
  color?: string;
  size?: number | string;
}

const Icon: React.FC<IconProps> = ({
  name,
  color = "currentColor",
  size = 24,
  className,
  onClick,
  ...props
}) => {
  if (!name) {
    return <></>;
  }

  return React.createElement(Icons[name], {
    color,
    size,
    className: cn("icon", onClick && "icon-clickable", className),
    onClick,
    ...props,
  });
};

export { Icon, IconNames, type IconNameType, type IconProps };
