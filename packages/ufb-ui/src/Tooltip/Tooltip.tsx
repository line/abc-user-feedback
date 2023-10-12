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
import React, { useRef, useState } from 'react';
import type { Side } from '@floating-ui/react';
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';

export interface ITooltipProps {
  children: React.ReactElement;
  title: string;
  place?: Side;
}

export const Tooltip: React.FC<ITooltipProps> = ({
  children,
  title,
  place = 'bottom',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
    placement: place,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      {React.cloneElement(children, {
        ref: refs.setReference,
        ...getReferenceProps(),
      })}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="bg-fill-primary font-12-regular text-inverse rounded px-4 py-2.5"
          {...getFloatingProps()}
        >
          {title}
          <FloatingArrow ref={arrowRef} context={context} />
        </div>
      )}
    </>
  );
};
