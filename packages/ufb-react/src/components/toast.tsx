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
import { Toaster as Sonner, toast } from "sonner";

import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { Spinner } from "./spinner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({
  className,
  toastOptions,
  icons,
  ...props
}: ToasterProps) => {
  return (
    <Sonner
      className={cn("toaster", className)}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn("toast", toastOptions?.classNames?.toast ?? ""),
          title: cn("toast-title", toastOptions?.classNames?.title ?? ""),
          description: cn(
            "toast-description",
            toastOptions?.classNames?.description ?? "",
          ),
          loader: cn("toast-loader", toastOptions?.classNames?.loader ?? ""),
          cancelButton: cn(
            "toast-close button button-ghost button-medium button-radius-medium",
            toastOptions?.classNames?.cancelButton ?? "",
          ),
          actionButton: cn(
            "toast-button button button-outline button-medium button-radius-medium",
            toastOptions?.classNames?.actionButton ?? "",
          ),
          success: cn("toast-success", toastOptions?.classNames?.success ?? ""),
          error: cn("toast-error", toastOptions?.classNames?.error ?? ""),
          info: cn("toast-info", toastOptions?.classNames?.info ?? ""),
          warning: cn("toast-warning", toastOptions?.classNames?.warning ?? ""),
          loading: "",
          default: cn("toast-default", toastOptions?.classNames?.default ?? ""),
          content: cn("toast-content", toastOptions?.classNames?.content ?? ""),
          icon: cn("toast-icon", toastOptions?.classNames?.icon ?? ""),
        },
      }}
      icons={{
        ...icons,
        loading: icons?.loading ?? <Spinner size="small" />,
        warning: icons?.warning ?? (
          <Icon
            name="RiErrorWarningFill"
            size={20}
            className="toast-icon-warning"
          />
        ),
        success: icons?.success ?? (
          <Icon
            name="RiCheckboxCircleFill"
            size={20}
            className="toast-icon-success"
          />
        ),
        error: icons?.success ?? (
          <Icon
            name="RiCloseCircleFill"
            size={20}
            className="toast-icon-error"
          />
        ),
        info: icons?.info ?? (
          <Icon
            name="RiInformation2Fill"
            size={20}
            className="toast-icon-informative"
          />
        ),
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
