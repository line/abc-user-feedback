import React, { useRef, useState } from "react";
import { cva } from "class-variance-authority";

import type { Radius, Size } from "../lib/types";
import { ICON_SIZE } from "../constants";
import { cn, composeRefs } from "../lib/utils";
import { Icon } from "./icon";

type InputType = "text" | "search" | "id" | "password";
type CaptionType = "default" | "success" | "info" | "error";

const defaultContext: InputProps = {
  size: "small",
  radius: "medium",
  type: "text",
};

const InputFieldContext = React.createContext<InputProps>(defaultContext);

function useInputFieldContext() {
  const context = React.useContext(InputFieldContext);
  return context;
}

function InputFieldProvider(props: InputProps) {
  const { children, ...rest } = props;

  return (
    <InputFieldContext.Provider value={rest}>
      {children}
    </InputFieldContext.Provider>
  );
}

const InputField = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
  (props, ref) => {
    const { children } = props;

    return (
      <div ref={ref} className={cn("input")}>
        <InputFieldProvider>{children}</InputFieldProvider>
      </div>
    );
  },
);

InputField.displayName = "InputField";

const inputVariants = cva("input-box", {
  variants: {
    size: {
      large: "input-box-large",
      medium: "input-box-medium",
      small: "input-box-small",
    },
    radius: {
      large: "input-box-radius-large",
      medium: "input-box-radius-medium",
      small: "input-box-radius-small",
    },
    disabled: {
      true: "input-box-disabled",
      false: "",
    },
    hasError: {
      true: "input-box-error",
      false: "",
    },
    defaultVariants: {
      size: "small",
      radius: "medium",
      disabled: false,
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

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: Size;
  type?: InputType;
  radius?: Radius;
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    size = "small",
    type = "text",
    radius = "medium",
    hasError,
    disabled,
    onChange,
    className,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleClick = () => {
    if (type === "password") {
      setShowPassword((showPassword) => !showPassword);
    } else {
      setShowButton(false);
      inputRef.current?.value && (inputRef.current.value = "");
      inputRef.current?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowButton(!!e.target.value);
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget) && inputRef.current?.value) {
      setShowButton(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowButton(false);
    }
  };

  return (
    <div
      className={cn(
        inputVariants({ size, radius, disabled, hasError, className }),
      )}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {TypeIcon(size)[type]}
      <input
        {...rest}
        spellCheck="false"
        type={type === "password" && !showPassword ? "password" : "text"}
        ref={composeRefs(inputRef, ref)}
        onChange={handleChange}
        disabled={disabled}
      />
      {(showButton || type === "password") && (
        <button
          type="button"
          onClick={handleClick}
          className={cn("input-button")}
          disabled={disabled}
        >
          {ButtonIcon(size, showPassword)[type]}
        </button>
      )}
    </div>
  );
});

Input.displayName = "Input";

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
}

const InputCaption = React.forwardRef<HTMLElement, InputCaptionProps>(
  (props, ref) => {
    const { type = "default", children } = props;
    const { size = "small" } = useInputFieldContext();

    return (
      <span ref={ref} className={cn(inputCaptionVariants({ type }))}>
        {CaptionIcon(size)[type]}
        {children}
      </span>
    );
  },
);

InputCaption.displayName = "InputCaption";

export { InputField, Input, InputLabel, InputCaption, type InputProps };

const ButtonIcon = (
  size: Size,
  showPassword: boolean,
): Record<InputType, React.ReactNode> => {
  return {
    text: <Icon name="RiCloseCircleFill" size={ICON_SIZE[size]} />,
    search: <Icon name="RiCloseCircleFill" size={ICON_SIZE[size]} />,
    id: <Icon name="RiCloseCircleFill" size={ICON_SIZE[size]} />,
    password: (
      <Icon
        name={showPassword ? "RiEyeCloseFill" : "RiEyeFill"}
        size={ICON_SIZE[size]}
      />
    ),
  };
};

const TypeIcon = (size: Size): Record<InputType, React.ReactNode> => {
  return {
    text: null,
    search: <Icon name="RiSearchLine" size={ICON_SIZE[size]} />,
    id: <Icon name="RiUser3Fill" size={ICON_SIZE[size]} />,
    password: <Icon name="RiLockPasswordFill" size={ICON_SIZE[size]} />,
  };
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
