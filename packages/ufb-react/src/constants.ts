import type { IconNameType } from "./components";
import type { CaptionType } from "./lib/types";
import type { Size } from "./types";

export const ICON_SIZE: Record<Size, number> = {
  large: 24,
  medium: 20,
  small: 16,
};

export const SMALL_ICON_SIZE: Record<Size, number> = {
  large: 16,
  medium: 16,
  small: 12,
};

export const CHECK_ICON_SIZE: Record<Size, number> = {
  large: 20,
  medium: 16,
  small: 14,
};

export const INPUT_CAPTION_ICON_SIZE: Record<Size, number> = {
  large: 20,
  medium: 16,
  small: 16,
};

export const CAPTION_DEFAULT_ICON: Record<
  CaptionType,
  IconNameType | undefined
> = {
  default: undefined,
  error: "RiErrorWarningFill",
  info: "RiInformationFill",
  success: "RiCheckboxCircleFill",
} as const;

export const ALERT_DEFAULT_ICON: Record<string, IconNameType | undefined> = {
  default: undefined,
  warning: "RiErrorWarningFill",
  informative: "RiInformation2Fill",
  success: "RiCheckboxCircleFill",
  error: "RiCloseCircleFill",
};
