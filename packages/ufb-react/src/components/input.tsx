import type { ButtonHTMLAttributes, HTMLInputTypeAttribute } from "react";
import React, { useRef } from "react";
import { cva } from "class-variance-authority";

import type { CaptionType, Radius, Size } from "../lib/types";
import type { IconNameType, IconProps } from "./icon";
import {
  CAPTION_DEFAULT_ICON,
  ICON_SIZE,
  INPUT_CAPTION_ICON_SIZE,
} from "../constants";
import { cn, composeRefs } from "../lib/utils";
import { Icon } from "./icon";
import useTheme from "./use-theme";

type TextInputType = ("text" | "email" | "password" | "search" | "tel") &
  HTMLInputTypeAttribute;

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
  size: undefined,
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
    error: {
      true: "input-error",
      false: "",
    },
    defaultVariants: {
      size: undefined,
      radius: undefined,
      error: false,
    },
  },
});

const inputCaptionVariants = cva("input-caption", {
  variants: {
    variant: {
      default: "input-caption-default",
      success: "input-caption-success",
      info: "input-caption-info",
      error: "input-caption-error",
    },
    size: {
      large: "input-caption-large",
      medium: "input-caption-medium",
      small: "input-caption-small",
    },
    defaultVariants: {
      size: undefined,
      variant: "default",
    },
  },
});

const inputCaptionIconVariants = cva("input-caption-icon", {
  variants: {
    size: {
      large: "input-caption-icon-large",
      medium: "input-caption-icon-medium",
      small: "input-caption-icon-small",
    },
    defaultVariants: {
      size: undefined,
    },
  },
});

interface InputBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: Size;
}

const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  ({ size, className, children, ...props }, ref) => {
    const { themeSize } = useTheme();

    return (
      <InputContext.Provider value={{ size: size ?? themeSize }}>
        <div ref={ref} className={cn("input-box", className)} {...props}>
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
  error?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const {
      size,
      type = "text",
      radius,
      error = false,
      disabled = false,
      onFocus,
      onBlur,
      className,
      ...rest
    } = props;

    const { themeRadius } = useTheme();
    const { size: boxSize } = React.useContext(InputContext);
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
            radius: radius ?? themeRadius,
            error,
            className,
          }),
        )}
      />
    );
  },
);

TextInput.displayName = "TextInput";

const InputLabel = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"strong">
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <strong ref={ref} className={cn("input-label", className)} {...rest} />
  );
});
InputLabel.displayName = "InputLabel";

interface InputCaptionProps extends React.ComponentPropsWithoutRef<"span"> {
  icon?: IconNameType;
  variant?: CaptionType;
  size?: Size;
}

const InputCaption = React.forwardRef<HTMLElement, InputCaptionProps>(
  (props, ref) => {
    const {
      icon = undefined,
      variant = "default",
      size,
      className,
      children,
      ...rest
    } = props;
    const { themeSize } = useTheme();

    return (
      <span
        ref={ref}
        className={cn(
          inputCaptionVariants({ size: size ?? themeSize, variant, className }),
        )}
        {...rest}
      >
        <React.Fragment>
          <Icon
            name={icon ?? CAPTION_DEFAULT_ICON[variant]}
            size={INPUT_CAPTION_ICON_SIZE[size ?? themeSize]}
            className={cn(
              inputCaptionIconVariants({
                size: size ?? themeSize,
              }),
            )}
          />
          {children}
        </React.Fragment>
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
      size: undefined,
    },
  },
});
const InputIcon = ({ className, ...props }: IconProps) => {
  const { size } = React.useContext(InputContext);
  const { themeSize } = useTheme();
  return (
    <Icon
      {...props}
      size={ICON_SIZE[size ?? themeSize]}
      className={cn(inputIconVariants({ size: size ?? themeSize, className }))}
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
      size: undefined,
    },
  },
});
const InputClearButton = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { size } = React.useContext(InputContext);
  const { themeSize } = useTheme();
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        inputButtonVariants({ size: size ?? themeSize, className }),
        "show-only-on-focus-and-has-value",
      )}
      aria-label="Reset input text"
      {...props}
    >
      <Icon name="RiCloseCircleFill" size={ICON_SIZE[size ?? themeSize]} />
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
  const { size } = React.useContext(InputContext);
  const { themeSize } = useTheme();

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
      className={cn(
        inputButtonVariants({ size: size ?? themeSize, className }),
      )}
      onClick={handleClick}
      aria-label={visible ? "hide password" : "show password"}
      {...props}
    >
      {visible ? (
        <Icon name="RiEyeCloseFill" size={ICON_SIZE[size ?? themeSize]} />
      ) : (
        <Icon name="RiEyeFill" size={ICON_SIZE[size ?? themeSize]} />
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
