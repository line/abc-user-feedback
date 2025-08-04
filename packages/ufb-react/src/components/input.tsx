/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
"use client";

import type { ButtonHTMLAttributes, HTMLInputTypeAttribute } from "react";
import React, { useRef } from "react";
import { cva } from "class-variance-authority";

import type { Radius, Size } from "../lib/types";
import type { IconProps } from "./icon";
import { ICON_SIZE } from "../constants";
import { cn, composeRefs } from "../lib/utils";
import { Icon } from "./icon";
import useTheme from "./use-theme";

type TextInputType = (
  | "text"
  | "email"
  | "password"
  | "search"
  | "tel"
  | "number"
) &
  HTMLInputTypeAttribute;

const InputField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("input-field", className)} {...props} />;
});
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
    defaultVariants: {
      size: undefined,
      radius: undefined,
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
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const {
      size,
      type = "text",
      radius,
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
            className,
          }),
        )}
      />
    );
  },
);

TextInput.displayName = "TextInput";

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
  InputClearButton,
  InputEyeButton,
  InputIcon,
  type TextInputProps,
};
