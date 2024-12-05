import * as React from "react";
import { Slottable } from "@radix-ui/react-slot";
import { Command as CommandPrimitive } from "cmdk";

import type { TriggerType } from "../lib/types";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea, ScrollBar } from "./scroll-area";

const ComboboxContext = React.createContext<{
  trigger: TriggerType;
  isHover: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<TriggerType>>;
  setIsHover: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  trigger: "click",
  setTrigger: () => "click",
  isHover: false,
  setIsHover: () => false,
});

const Combobox = ({
  open = false,
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof Popover>) => {
  const [trigger, setTrigger] = React.useState<TriggerType>("click");
  const [isHover, setIsHover] = React.useState(false);
  return (
    <ComboboxContext.Provider
      value={{ trigger, setTrigger, isHover, setIsHover }}
    >
      <Popover
        {...props}
        open={open || isHover}
        onOpenChange={(open: boolean) => {
          setIsHover(open);
          onOpenChange?.(open);
        }}
      />
    </ComboboxContext.Provider>
  );
};

const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, onMouseEnter, onMouseLeave, ...props }, ref) => {
  const { trigger, setIsHover } = React.useContext(ComboboxContext);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger === "hover") {
      setIsHover(true);
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger === "hover") {
      setIsHover(false);
    }
    onMouseLeave?.(e);
  };

  return (
    <PopoverContent
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
      className={cn("combobox-content", className)}
    >
      <CommandPrimitive>{children}</CommandPrimitive>
    </PopoverContent>
  );
});
ComboboxContent.displayName = CommandPrimitive.displayName;

const ComboboxInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="combobox-input-box" cmdk-input-wrapper="">
    <Icon name="RiSearchLine" size={16} className="combobox-icon" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn("combobox-input", className)}
      {...props}
    />
  </div>
));

ComboboxInput.displayName = CommandPrimitive.Input.displayName;

const ComboboxList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> & {
    maxHeight?: string;
  }
>(({ maxHeight, className, ...props }, ref) => (
  <ScrollArea maxHeight={maxHeight}>
    <CommandPrimitive.List
      ref={ref}
      className={cn("combobox-list", className)}
      {...props}
    />
    <ScrollBar />
  </ScrollArea>
));

ComboboxList.displayName = CommandPrimitive.List.displayName;

const ComboboxEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="combobox-empty" {...props} />
));

ComboboxEmpty.displayName = CommandPrimitive.Empty.displayName;

const ComboboxGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn("combobox-group", className)}
    {...props}
  />
));

ComboboxGroup.displayName = CommandPrimitive.Group.displayName;

const ComboboxSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("combobox-separator", className)}
    {...props}
  />
));
ComboboxSeparator.displayName = CommandPrimitive.Separator.displayName;

const ComboboxItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    inset?: boolean;
  }
>(({ inset, children, className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn("combobox-item", inset && "combobox-item-inset", className)}
    {...props}
  >
    {children}
  </CommandPrimitive.Item>
));

ComboboxItem.displayName = CommandPrimitive.Item.displayName;

const ComboboxCaption = React.forwardRef<
  React.ElementRef<"span">,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("combobox-caption", className)} {...props} />
));

ComboboxCaption.displayName = "ComboboxCaption";

const ComboboxSelectItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    checked?: boolean;
  }
>(({ checked, children, className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn("combobox-item", className)}
    {...props}
  >
    <Icon
      name="RiCheckLine"
      size={20}
      color={checked ? "currentColor" : "transparent"}
      className="combobox-check"
    />
    <Slottable>{children}</Slottable>
  </CommandPrimitive.Item>
));

ComboboxSelectItem.displayName = "ComboboxSelectItem";

const ComboboxTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & {
    trigger?: TriggerType;
  }
>(
  (
    {
      variant = "outline",
      trigger,
      className,
      children,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const { setTrigger, setIsHover } = React.useContext(ComboboxContext);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (trigger === "hover") {
        setIsHover(true);
      }
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (trigger === "hover") {
        setIsHover(false);
      }
      onMouseLeave?.(e);
    };

    React.useEffect(() => {
      if (trigger) {
        setTrigger(trigger);
      }
    }, []);

    if (props.asChild) {
      return (
        <PopoverTrigger
          className={className}
          ref={ref}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          {children}
        </PopoverTrigger>
      );
    }
    return (
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant={variant}
          className={cn("combobox-trigger", className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          {children}
        </Button>
      </PopoverTrigger>
    );
  },
);
ComboboxTrigger.displayName = "ComboboxTrigger";

export {
  Combobox,
  ComboboxContent,
  ComboboxCaption,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxSelectItem,
  ComboboxSeparator,
  ComboboxTrigger,
};
