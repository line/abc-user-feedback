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
import React from 'react';

import { cn } from '../utils';

type Size = 'sm' | 'md' | 'lg';
const CardContext = React.createContext<{ size: Size }>({
  size: 'md',
});
interface Props
  extends React.PropsWithChildren,
    React.HTMLAttributes<HTMLDivElement> {
  size?: Size;
  className?: string;
}

export const Card = (props: Props) => {
  const { size = 'md', children, className, ...otherProps } = props;

  return (
    <CardContext.Provider value={{ size }}>
      <div
        className={cn(
          'rounded-8 border-neutral-tertiary bg-neutral-primary flex flex-col gap-4 border py-6', // shadow-default
          className,
          { 'gap-4 py-4': size === 'sm' },
        )}
        {...otherProps}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
};

export const CardBody = (
  props: React.PropsWithChildren & React.HTMLAttributes<HTMLDivElement>,
) => {
  const { children, className, ...divProps } = props;

  const { size } = React.useContext(CardContext);

  return (
    <div
      className={cn('px-6', { 'px-4': size === 'sm' }, className)}
      {...divProps}
    >
      {children}
    </div>
  );
};

export const CardHeader = (
  props: React.PropsWithChildren &
    React.HTMLAttributes<HTMLDivElement> & {
      action?: React.ReactNode;
    },
) => {
  const { children, className, action, ...divProps } = props;

  const { size } = React.useContext(CardContext);

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-6 px-6',
        { 'px-4': size === 'sm' },
        className,
      )}
      {...divProps}
    >
      <div>{children}</div>
      {action}
    </div>
  );
};

export const CardTitle = (
  props: React.PropsWithChildren &
    React.HTMLAttributes<HTMLHeadingElement> & { size?: Size },
) => {
  const { children, className, ...divProps } = props;

  const { size } = React.useContext(CardContext);

  return (
    <h4
      className={cn(
        'mb-1',
        {
          'text-title-h4': (props.size ?? size) === 'lg',
          'text-title-h5': (props.size ?? size) === 'md',
          'text-base-strong': (props.size ?? size) === 'sm',
        },
        className,
      )}
      {...divProps}
    >
      {children}
    </h4>
  );
};

export const CardDescription = (
  props: React.PropsWithChildren &
    React.HTMLAttributes<HTMLHeadingElement> & {},
) => {
  const { children, className, ...divProps } = props;

  return (
    <p
      className={cn('text-neutral-tertiary text-small-normal', className)}
      {...divProps}
    >
      {children}
    </p>
  );
};
