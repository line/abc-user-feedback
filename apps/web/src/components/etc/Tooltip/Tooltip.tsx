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
import {
  FloatingArrow,
  FloatingPortal,
  Placement,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { Icon } from '@ufb/ui';
import { useRef, useState } from 'react';

interface IProps {
  placement?: Placement;
  description?: string;
}

const Tooltip: React.FC<IProps> = ({ placement, description }) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement ?? 'right',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({ fallbackAxisSideDirection: 'start' }),
      shift(),
      arrow({ element: arrowRef }),
    ],
  });

  // Event listeners to change the open state
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  // Role props for screen readers
  const role = useRole(context, { role: 'tooltip' });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()} className="ml-1">
        <Icon
          name="InfoCircleFill"
          size={16}
          className="text-tertiary cursor-pointer"
        />
      </button>
      <FloatingPortal>
        {isOpen && (
          <div
            className="bg-fill-primary p-2 rounded whitespace-pre-line"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <p className="text-fill-inverse font-12-regular">{description}</p>
            <FloatingArrow ref={arrowRef} context={context} />
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default Tooltip;
