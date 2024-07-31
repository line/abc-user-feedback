import {
  Alert,
  AlertButton,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTextContainer,
  AlertTitle,
} from "./alert";
import { Toast, ToastClose, ToastProvider, ToastViewport } from "./toast";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(
        ({ id, variant, icon, title, description, action, ...props }) => (
          <Toast key={id} {...props}>
            <Alert variant={variant}>
              <AlertContent>
                {((!!variant && variant !== "default") || !!icon) && (
                  <AlertIcon name={icon} />
                )}
                <AlertTextContainer>
                  {title && <AlertTitle>{title}</AlertTitle>}
                  {description && (
                    <AlertDescription>{description}</AlertDescription>
                  )}
                </AlertTextContainer>
              </AlertContent>
              {action && (
                <AlertButton onClick={action.onClick}>
                  {action.text}
                </AlertButton>
              )}
              <ToastClose />
            </Alert>
          </Toast>
        ),
      )}
      <ToastViewport />
    </ToastProvider>
  );
}
