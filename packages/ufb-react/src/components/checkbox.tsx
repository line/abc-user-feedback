import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";

import type { Size } from "../lib/types";
import { CHECK_ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import useTheme from "./use-theme";

const defaultVariants: {
  size?: Size;
} = {
  size: undefined,
};

const checkboxVariants = cva("checkbox", {
  variants: {
    size: {
      small: "checkbox-small",
      medium: "checkbox-medium",
      large: "checkbox-large",
    },
  },
  defaultVariants,
});

const checkVariants = cva("check", {
  variants: {
    size: {
      small: "check-small",
      medium: "check-medium",
      large: "check-large",
    },
  },
  defaultVariants,
});

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  size?: Size;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      checked: defaultChecked = false,
      size,
      children,
      className,
      onCheckedChange,
      ...props
    },
    ref,
  ) => {
    const { themeSize } = useTheme();
    const [checked, setChecked] =
      React.useState<CheckboxPrimitive.CheckedState>(false);

    const handleCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
      setChecked(checked);
      onCheckedChange?.(checked);
    };

    React.useEffect(() => {
      setChecked(defaultChecked);
    }, [defaultChecked]);

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(checkboxVariants({ size: size ?? themeSize, className }))}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        {...props}
      >
        <React.Fragment>
          <span className={cn(checkVariants({ size }))}>
            <CheckboxPrimitive.Indicator className={cn("checkbox-icon")}>
              <Icon
                name={
                  checked === "indeterminate" ? "RiSubtractLine" : "RiCheckLine"
                }
                size={CHECK_ICON_SIZE[size ?? themeSize]}
              />
            </CheckboxPrimitive.Indicator>
          </span>
          {children}
        </React.Fragment>
      </CheckboxPrimitive.Root>
    );
  },
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, type CheckboxProps };
