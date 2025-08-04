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

import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { ButtonVariant, Radius, Size } from "../lib/types";
import { cn, composeRefs } from "../lib/utils";
import { Spinner } from "./spinner";
import useTheme from "./use-theme";

const defaultVariants: {
  variant: ButtonVariant;
  size?: Size;
  radius?: Radius;
  loading?: boolean;
} = {
  variant: "primary",
  size: undefined,
  radius: undefined,
  loading: false,
};

const buttonVariants = cva("button", {
  variants: {
    variant: {
      primary: "button-primary",
      secondary: "button-secondary",
      destructive: "button-destructive",
      ghost: "button-ghost",
      outline: "button-outline",
    },
    size: {
      small: "button-small",
      medium: "button-medium",
      large: "button-large",
    },
    radius: {
      small: "button-radius-small",
      medium: "button-radius-medium",
      large: "button-radius-large",
    },
    loading: {
      true: "!text-transparent [&>*:not(.button-loading)]:!invisible",
      false: "",
    },
  },
  defaultVariants,
});

const buttonLoadingVariants = cva("button-loading", {
  variants: {
    variant: {
      primary: "button-loading-primary",
      secondary: "button-loading-secondary",
      destructive: "button-loading-destructive",
      ghost: "button-loading-ghost",
      outline: "button-loading-outline",
    },
  },
  defaultVariants,
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant?: ButtonVariant;
  size?: Size;
  radius?: Radius;
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      type = "button",
      variant = "primary",
      size,
      radius,
      disabled = false,
      loading = false,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const { themeSize, themeRadius } = useTheme();
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
      if (!buttonRef.current) return;

      const childNodes = buttonRef.current.childNodes;
      const isSvgOnly = Array.from(childNodes).every(
        (node) =>
          ((node as HTMLElement).nodeType === Node.ELEMENT_NODE &&
            (node as HTMLElement).tagName.toLowerCase() === "svg") ||
          ((node as HTMLElement).nodeType === Node.TEXT_NODE &&
            !(node as HTMLElement).textContent?.trim()),
      );

      if (isSvgOnly) {
        buttonRef.current.classList.add("svg-only");
      }
    }, []);

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size: size ?? themeSize,
            radius: radius ?? themeRadius,
            loading,
            className,
          }),
        )}
        type={type}
        disabled={disabled || loading}
        ref={composeRefs(buttonRef, ref)}
        {...props}
      >
        <Slottable>{children}</Slottable>
        {loading && (
          <span className={cn(buttonLoadingVariants({ variant }))}>
            <Spinner size={size ?? themeSize} />
          </span>
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps, buttonVariants };
