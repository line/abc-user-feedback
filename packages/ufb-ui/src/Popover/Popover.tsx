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
import type { Placement } from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';

import type { IIconProps } from '../Icon';
import { Icon } from '../Icon';

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function usePopover({
  initialOpen = false,
  placement = 'bottom',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: PopoverOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<
    string | undefined
  >();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'end',
        padding: 5,
      }),
      shift({ padding: 6 }),
    ],
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId],
  );
}

type ContextType =
  | (ReturnType<typeof usePopover> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionId: React.Dispatch<
        React.SetStateAction<string | undefined>
      >;
    })
  | null;

const PopoverContext = React.createContext<ContextType>(null);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return context;
};

export function Popover({
  children,
  modal = false,
  ...restOptions
}: {
  children: React.ReactNode;
} & PopoverOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, ...restOptions });
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();
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
      type="button"
      // The user can style the trigger based on the state
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & {
    isPortal?: boolean;
    disabledFloatingStyle?: boolean;
    diabledDimmed?: boolean;
  }
>(function PopoverContent(
  {
    style,
    isPortal = false,
    disabledFloatingStyle = false,
    diabledDimmed = false,
    ...props
  },
  propRef,
) {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  const child = (
    <FloatingFocusManager context={floatingContext} modal={context.modal}>
      <div
        ref={ref}
        style={{
          ...(context.modal || disabledFloatingStyle
            ? { position: 'absolute' }
            : context.floatingStyles),
          zIndex: 50,
          ...style,
        }}
        aria-labelledby={context.labelId}
        aria-describedby={context.descriptionId}
        {...context.getFloatingProps(props)}
        className={[
          'bg-primary border-fill-secondary rounded border shadow-sm',
          context.getFloatingProps(props).className,
        ].join(' ')}
      >
        {props.children}
      </div>
    </FloatingFocusManager>
  );

  const modalChild = context.modal ? (
    <FloatingOverlay
      lockScroll={context.modal}
      className={diabledDimmed ? '' : 'bg-dim'}
      style={{ display: 'grid', placeItems: 'center', zIndex: 20 }}
    >
      {child}
    </FloatingOverlay>
  ) : (
    child
  );

  return isPortal ? <FloatingPortal>{modalChild}</FloatingPortal> : modalChild;
});

export const PopoverHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLProps<HTMLHeadingElement>
>(function PopoverHeading(props, ref) {
  const { className, ...otherProps } = props;
  const { setLabelId, setOpen } = usePopoverContext();
  const id = useId();

  React.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <div
      className="m-5 flex justify-between gap-5"
      {...otherProps}
      ref={ref}
      id={id}
    >
      <h1 className={['font-16-bold', className].join(' ')}>
        {props.children}
      </h1>
      <button
        className="icon-btn icon-btn-tertiary icon-btn-xs"
        onClick={() => setOpen(false)}
      >
        <Icon name="Close" />
      </button>
    </div>
  );
});
export const PopoverCloseButton: React.FC = () => {
  const { setLabelId, setOpen } = usePopoverContext();
  const id = useId();

  React.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <button
      className="icon-btn icon-btn-tertiary icon-btn-xs"
      onClick={() => setOpen(false)}
    >
      <Icon name="Close" />
    </button>
  );
};

export interface IPopoverModalContentProps extends React.PropsWithChildren {
  title: string;
  description?: string;
  icon?: IIconProps;
  submitButton: {
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    form?: string;
    type?: 'submit' | 'reset' | 'button' | undefined;
  };
  cancelButton?: {
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };
  width?: number;
}

export const PopoverModalContent: React.FC<IPopoverModalContentProps> = (
  props,
) => {
  const {
    title,
    description,
    children,
    submitButton,
    icon,
    cancelButton,
    width = 400,
  } = props;
  const { setOpen } = usePopoverContext();

  return (
    <PopoverContent isPortal>
      <PopoverHeading>{title}</PopoverHeading>
      <div className="m-5" style={{ width }}>
        {icon && (
          <div className="mb-6 text-center">
            <Icon {...icon} />
          </div>
        )}
        {description && (
          <p
            className={[
              'font-14-regular mb-10 whitespace-pre-line',
              icon ? 'text-center' : '',
            ].join(' ')}
          >
            {description}
          </p>
        )}
        <div className="mb-5">{children}</div>
        <div className="flex justify-end gap-2">
          {cancelButton && (
            <button
              {...cancelButton}
              className="btn btn-secondary"
              onClick={cancelButton.onClick ?? (() => setOpen(false))}
            />
          )}
          <button
            {...submitButton}
            className={['btn btn-primary', submitButton.className].join(' ')}
            type={submitButton.type || 'button'}
          />
        </div>
      </div>
    </PopoverContent>
  );
};
