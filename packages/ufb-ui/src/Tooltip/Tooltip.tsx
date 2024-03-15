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
import * as React from 'react';
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
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/react';

import type { ColorType } from '../types/color.type';

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);

  const arrowRef = React.useRef(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(16),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
      arrow({ element: arrowRef }),
    ],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return React.useMemo(
    () => ({ open, setOpen, arrowRef, ...interactions, ...data }),
    [open, setOpen, interactions, data],
  );
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};

export function Tooltip({
  children,
  ...options
}: { children: React.ReactNode } & TooltipOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.open ? 'open' : 'closed',
      }),
    );
  }

  return (
    <button
      ref={ref}
      // The user can style the trigger based on the state
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & { color?: ColorType }
>(function TooltipContent({ style, color, className, ...props }, propRef) {
  const context = useTooltipContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);
  const [bgCN, textCN, arrowCN]: [string, string, string] =
    React.useMemo(() => {
      switch (color) {
        case 'blue':
          return [
            'bg-blue-quaternary',
            'text-blue-primary',
            'fill-blue-quaternary',
          ];
        case 'green':
          return [
            'bg-green-quaternary',
            'text-green-primary',
            'fill-green-quaternary',
          ];
        case 'navy':
          return [
            'bg-navy-quaternary',
            'text-navy-primary',
            'fill-navy-quaternary',
          ];
        case 'orange':
          return [
            'bg-orange-quaternary',
            'text-orange-primary',
            'fill-orange-quaternary',
          ];
        case 'purple':
          return [
            'bg-purple-quaternary',
            'text-purple-primary',
            'fill-purple-quaternary',
          ];
        case 'red':
          return [
            'bg-red-quaternary',
            'text-red-primary',
            'fill-red-quaternary',
          ];
        case 'yellow':
          return [
            'bg-yellow-quaternary',
            'text-yellow-primary',
            'fill-yellow-quaternary',
          ];
        default:
          return ['bg-fill-primary', 'text-fill-inverse', 'fill-primary'];
      }
    }, [color]);

  if (!context.open) return null;
  return (
    <div
      ref={ref}
      style={{ ...context.floatingStyles, ...style }}
      className={[
        'font-12-regular z-40 min-w-[50px] rounded p-2',
        bgCN,
        textCN,
        className,
      ].join(' ')}
      {...context.getFloatingProps(props)}
    >
      {props.children}
      <FloatingArrow
        ref={context.arrowRef}
        context={context.context}
        className={arrowCN}
      />
    </div>
  );
});
