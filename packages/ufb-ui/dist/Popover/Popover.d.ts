import { Placement } from '@floating-ui/react';
import * as React from 'react';
interface PopoverOptions {
    initialOpen?: boolean;
    placement?: Placement;
    modal?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}
export declare function usePopover({ initialOpen, placement, modal, open: controlledOpen, onOpenChange: setControlledOpen, }?: PopoverOptions): {
    modal: boolean | undefined;
    labelId: string | undefined;
    descriptionId: string | undefined;
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
    setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
    placement: Placement;
    strategy: import("@floating-ui/react").Strategy;
    middlewareData: import("@floating-ui/react").MiddlewareData;
    x: number;
    y: number;
    update: () => void;
    context: {
        placement: Placement;
        strategy: import("@floating-ui/react").Strategy;
        x: number;
        y: number;
        middlewareData: import("@floating-ui/react").MiddlewareData;
        update: () => void;
        isPositioned: boolean;
        floatingStyles: React.CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean) => void;
        events: import("@floating-ui/react").FloatingEvents;
        dataRef: React.MutableRefObject<import("@floating-ui/react").ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
        elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
    };
    refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
    elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
    isPositioned: boolean;
    floatingStyles: React.CSSProperties;
    getReferenceProps: (userProps?: React.HTMLProps<Element> | undefined) => Record<string, unknown>;
    getFloatingProps: (userProps?: React.HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
    getItemProps: (userProps?: React.HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
    open: boolean;
    setOpen: (open: boolean) => void;
};
export declare const usePopoverContext: () => {
    modal: boolean | undefined;
    labelId: string | undefined;
    descriptionId: string | undefined;
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
    setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
    placement: Placement;
    strategy: import("@floating-ui/react").Strategy;
    middlewareData: import("@floating-ui/react").MiddlewareData;
    x: number;
    y: number;
    update: () => void;
    context: {
        placement: Placement;
        strategy: import("@floating-ui/react").Strategy;
        x: number;
        y: number;
        middlewareData: import("@floating-ui/react").MiddlewareData;
        update: () => void;
        isPositioned: boolean;
        floatingStyles: React.CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean) => void;
        events: import("@floating-ui/react").FloatingEvents;
        dataRef: React.MutableRefObject<import("@floating-ui/react").ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
        elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
    };
    refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
    elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
    isPositioned: boolean;
    floatingStyles: React.CSSProperties;
    getReferenceProps: (userProps?: React.HTMLProps<Element> | undefined) => Record<string, unknown>;
    getFloatingProps: (userProps?: React.HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
    getItemProps: (userProps?: React.HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
    open: boolean;
    setOpen: (open: boolean) => void;
} & {
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
    setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
};
export declare function Popover({ children, modal, ...restOptions }: {
    children: React.ReactNode;
} & PopoverOptions): import("react/jsx-runtime").JSX.Element;
interface PopoverTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}
export declare const PopoverTrigger: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLElement> & PopoverTriggerProps, "ref"> & React.RefAttributes<HTMLElement>>;
export declare const PopoverContent: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLDivElement> & {
    isPortal?: boolean | undefined;
    disabledFloatingStyle?: boolean | undefined;
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
export declare const PopoverHeading: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>>;
export {};
//# sourceMappingURL=Popover.d.ts.map