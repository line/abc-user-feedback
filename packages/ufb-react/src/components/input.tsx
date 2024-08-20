import type { ButtonHTMLAttributes, HTMLInputTypeAttribute } from "react";
import React, { useRef } from "react";
import { cva } from "class-variance-authority";

import type { Radius, Size } from "../lib/types";
import type { IconProps } from "./icon";
import { ICON_SIZE } from "../constants";
import { cn, composeRefs } from "../lib/utils";
import { Icon } from "./icon";

type TextInputType = ("text" | "email" | "password" | "search" | "tel") &
  HTMLInputTypeAttribute;
type CaptionType = "default" | "success" | "info" | "error";

const InputField = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
  (props, ref) => {
    const { children } = props;

    return (
      <div ref={ref} className="input-field">
        {children}
      </div>
    );
  },
);
InputField.displayName = "InputField";

const defaultContext: TextInputProps = {
  size: "small",
};

const InputContext = React.createContext<TextInputProps>(defaultContext);

const inputVariants = cva("input", {
  variants: {
    size: {
      large: "input-large",
      medium: "input-medium",
      small: "input-small",
    },
    radius: {
      large: "input-radius-large",
      medium: "input-radius-medium",
      small: "input-radius-small",
    },
    hasError: {
      true: "input-error",
      false: "",
    },
    defaultVariants: {
      size: "small",
      radius: "medium",
      hasError: false,
    },
  },
});

const inputCaptionVariants = cva("input-caption", {
  variants: {
    type: {
      default: "input-caption-default",
      success: "input-caption-success",
      info: "input-caption-info",
      error: "input-caption-error",
    },
    defaultVariants: {
      type: "default",
    },
  },
});

interface InputBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: Size;
}

const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  ({ size = "small", className, children, onBlur, ...props }, ref) => {
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (!e.currentTarget.contains(e.relatedTarget)) {
        onBlur?.(e);
      }
    };

    return (
      <InputContext.Provider value={{ size }}>
        <div
          ref={ref}
          className={cn("input-box", className)}
          onBlur={handleBlur}
          {...props}
        >
          {children}
        </div>
      </InputContext.Provider>
    );
  },
);
InputBox.displayName = "InputBox";

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: Size;
  type?: TextInputType;
  radius?: Radius;
  hasError?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const {
      size,
      type = "text",
      radius = "medium",
      hasError,
      disabled,
      onFocus,
      onBlur,
      className,
      ...rest
    } = props;

    const { size: boxSize = "small" } = React.useContext(InputContext);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (!e.currentTarget.contains(e.relatedTarget)) {
        onFocus?.(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (!e.currentTarget.contains(e.relatedTarget)) {
        onBlur?.(e);
      }
    };

    return (
      <input
        {...rest}
        spellCheck="false"
        type={type}
        ref={composeRefs(inputRef, ref)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={cn(
          inputVariants({
            size: size ?? boxSize,
            radius,
            hasError,
            className,
          }),
        )}
      />
    );
  },
);

TextInput.displayName = "TextInput";

const InputLabel = React.forwardRef<HTMLElement, React.PropsWithChildren>(
  (props, ref) => {
    const { children } = props;
    return (
      <strong ref={ref} className={cn("input-label")}>
        {children}
      </strong>
    );
  },
);
InputLabel.displayName = "InputLabel";

interface InputCaptionProps extends React.PropsWithChildren {
  type?: CaptionType;
  size?: Size;
}

const InputCaption = React.forwardRef<HTMLElement, InputCaptionProps>(
  (props, ref) => {
    const { type = "default", size = "small", children } = props;

    return (
      <span ref={ref} className={cn(inputCaptionVariants({ type }))}>
        {CaptionIcon(size)[type]}
        {children}
      </span>
    );
  },
);
InputCaption.displayName = "InputCaption";

const inputIconVariants = cva("input-icon", {
  variants: {
    size: {
      large: "input-icon-large",
      medium: "input-icon-medium",
      small: "input-icon-small",
    },
    defaultVariants: {
      size: "small",
    },
  },
});
const InputIcon = ({ className, ...props }: IconProps) => {
  const { size = "small" } = React.useContext(InputContext);
  return (
    <Icon
      {...props}
      size={ICON_SIZE[size]}
      className={cn(inputIconVariants({ size, className }))}
    />
  );
};
InputIcon.displayName = "InputIcon";

const inputButtonVariants = cva("input-button", {
  variants: {
    size: {
      large: "input-button-large",
      medium: "input-button-medium",
      small: "input-button-small",
    },
    defaultVariants: {
      size: "small",
    },
  },
});
const InputClearButton = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { size = "small" } = React.useContext(InputContext);
  return (
    <button
      ref={ref}
      type="button"
      className={cn(inputButtonVariants({ size, className }))}
      aria-label="Reset input text"
      {...props}
    >
      <Icon name="RiCloseCircleFill" size={ICON_SIZE[size]} />
    </button>
  );
});
InputClearButton.displayName = "InputClearButton";

const InputEyeButton = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    onChangeVisibility?: (visible: boolean) => void;
  }
>(({ className, onClick, onChangeVisibility, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  const { size = "small" } = React.useContext(InputContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setVisible((visible) => !visible);
    onClick?.(e);
  };

  React.useEffect(() => {
    onChangeVisibility?.(visible);
  }, [visible]);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(inputButtonVariants({ size, className }))}
      onClick={handleClick}
      aria-label={visible ? "hide password" : "show password"}
      {...props}
    >
      {visible ? (
        <Icon name="RiEyeCloseFill" size={ICON_SIZE[size]} />
      ) : (
        <Icon name="RiEyeFill" size={ICON_SIZE[size]} />
      )}
    </button>
  );
});
InputEyeButton.displayName = "InputEyeButton";

export {
  InputField,
  InputBox,
  TextInput,
  InputLabel,
  InputCaption,
  InputClearButton,
  InputEyeButton,
  InputIcon,
  type TextInputProps,
};

const CaptionIcon = (size: Size): Record<CaptionType, React.ReactNode> => {
  return {
    default: null,
    error: (
      <Icon
        name="RiErrorWarningFill"
        size={ICON_SIZE[size]}
        className="input-caption-icon"
      />
    ),
    info: (
      <Icon
        name="RiInformationFill"
        size={ICON_SIZE[size]}
        className="input-caption-icon"
      />
    ),
    success: (
      <Icon
        name="RiCheckboxCircleFill"
        size={ICON_SIZE[size]}
        className="input-caption-icon"
      />
    ),
  };
};
