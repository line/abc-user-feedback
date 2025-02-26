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
