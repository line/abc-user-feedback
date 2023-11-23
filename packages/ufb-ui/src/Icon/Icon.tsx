/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
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
import React from 'react';

import * as svg from './svg';

export const IconNames = Object.keys(svg) as (keyof typeof svg)[];
export type IconNameType = keyof typeof svg;

export interface IIconProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  name: IconNameType;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IIconProps> = ({
  name,
  size = 24,
  className,
  ...props
}) => {
  return React.createElement(svg[name] ?? 'div', {
    width: size,
    height: size,
    className: ['inline-block', className].join(' '),
    ...props,
  });
};
