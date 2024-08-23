import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";

import type { IconNameType } from "./icon";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import useTheme from "./use-theme";

const alertVariants = cva("alert", {
  variants: {
    variant: {
      default: "alert-default",
      warning: "alert-warning",
      success: "alert-success",
      error: "alert-error",
      informative: "alert-informative",
    },
    radius: {
      small: "alert-radius-small",
      medium: "alert-radius-medium",
      large: "alert-radius-large",
    },
  },
  defaultVariants: {
    variant: "default",
    radius: undefined,
  },
});

const AlertContext = React.createContext<VariantProps<typeof alertVariants>>({
  variant: "default",
  radius: undefined,
});

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, className, variant = "default", radius, ...props }, ref) => {
    const { themeRadius } = useTheme();
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant, radius: radius ?? themeRadius }),
          className,
        )}
        {...props}
      >
        <AlertContext.Provider
          value={{ variant, radius: radius ?? themeRadius }}
        >
          {children}
        </AlertContext.Provider>
      </div>
    );
  },
);
Alert.displayName = "Alert";

type AlertContentProps = React.HTMLAttributes<HTMLHeadingElement>;

const AlertContent = React.forwardRef<HTMLParagraphElement, AlertContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("alert-content", className)} {...props}>
      {children}
    </div>
  ),
);
AlertContent.displayName = "AlertContent";

type AlertTextContainerProps = React.HTMLAttributes<HTMLHeadingElement>;

const AlertTextContainer = React.forwardRef<
  HTMLParagraphElement,
  AlertTextContainerProps
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("alert-text-container", className)} {...props}>
    {children}
  </div>
));
AlertTextContainer.displayName = "AlertTextContainer";

type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ children, className, ...props }, ref) => (
    <h5 ref={ref} className={cn("alert-title", className)} {...props}>
      {children}
    </h5>
  ),
);
AlertTitle.displayName = "AlertTitle";

type AlertDescriptionProps = React.HTMLAttributes<HTMLHeadingElement>;

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(({ children, className, ...props }, ref) => (
  <p className={cn("alert-description", className)} {...props} ref={ref}>
    {children}
  </p>
));
AlertDescription.displayName = "AlertDescription";

interface AlertIconButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof IconButton>, "icon"> {
  icon?: IconNameType;
}

const AlertIconButton = React.forwardRef<
  HTMLButtonElement,
  AlertIconButtonProps
>(({ icon, variant, size, className, ...props }, ref) => {
  const { radius } = React.useContext(AlertContext);
  return (
    <IconButton
      ref={ref}
      icon={icon ?? "RiCloseFill"}
      radius={radius ?? "medium"}
      size={size ?? "medium"}
      variant={variant ?? "ghost"}
      className={cn("alert-close", className)}
      {...props}
    />
  );
});

AlertIconButton.displayName = "AlertIconButton";

const AlertButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ variant, size, className, ...props }, ref) => {
  const { radius } = React.useContext(AlertContext);
  return (
    <Button
      ref={ref}
      variant={variant ?? "outline"}
      size={size ?? "medium"}
      radius={radius ?? "medium"}
      className={cn("alert-button", className)}
      {...props}
    />
  );
});
AlertButton.displayName = "AlertButton";

const Alert_Icon: Record<string, IconNameType | undefined> = {
  default: undefined,
  warning: "RiErrorWarningFill",
  informative: "RiInformation2Fill",
  success: "RiCheckboxCircleFill",
  error: "RiCloseCircleFill",
};

const alertIconVariants = cva("alert-icon", {
  variants: {
    variant: {
      default: "alert-icon-default",
      warning: "alert-icon-warning",
      success: "alert-icon-success",
      error: "alert-icon-error",
      informative: "alert-icon-informative",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface AlertIconProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Icon>, "name"> {
  name?: IconNameType;
}
const AlertIcon = ({
  className,
  name = "temp",
  size = 20,
  ...props
}: AlertIconProps) => {
  const { variant } = React.useContext(AlertContext);
  return (
    <Icon
      className={cn(alertIconVariants({ variant, className }))}
      name={Alert_Icon[variant ?? "default"] ?? name}
      size={size}
      {...props}
    />
  );
};
AlertIcon.displayName = "AlertIcon";

export {
  Alert,
  AlertContent,
  AlertTextContainer,
  AlertDescription,
  AlertTitle,
  AlertIconButton,
  AlertButton,
  AlertIcon,
  type AlertProps,
};
