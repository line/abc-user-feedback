import { CSSProperties } from "react";
import { Toaster as Sonner, toast } from "sonner";

import { Icon } from "./icon";
import { Spinner } from "./spinner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "toast alert",
          title: "alert-title",
          description: "alert-description",
          loader: "",
          cancelButton:
            "icon-button icon-button-ghost icon-button-medium icon-button-radius-medium alert-close toast-close",
          actionButton:
            "button button-outline button-medium button-radius-medium alert-button",
          success: "alert-success",
          error: "alert-error",
          info: "alert-informative",
          warning: "alert-warning",
          loading: "",
          default: "alert-default",
          content: "alert-text-container",
          icon: "alert-icon",
        },
      }}
      icons={{
        loading: <Spinner size="small" />,
        warning: (
          <Icon
            name="RiErrorWarningFill"
            size={20}
            className="alert-icon-warning"
          />
        ),
        success: (
          <Icon
            name="RiCheckboxCircleFill"
            size={20}
            className="alert-icon-success"
          />
        ),
        error: (
          <Icon
            name="RiCloseCircleFill"
            size={20}
            className="alert-icon-error"
          />
        ),
        info: (
          <Icon
            name="RiInformation2Fill"
            size={20}
            className="alert-icon-informative"
          />
        ),
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
