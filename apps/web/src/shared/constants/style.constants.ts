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

// Gradient styles for consistent use across the application
export const GRADIENT_STYLES = {
  primary: 'linear-gradient(105.34deg, #62A5F5 0%, #6ED2C3 100%)',
  primaryAlt: 'linear-gradient(95.64deg, #62A5F5 0%, #6ED2C3 100%)',
  fadeOut:
    'linear-gradient(180deg, rgba(239, 239, 239, 0) 0%, var(--bg-tertiary) 100%)',
} as const;

// Gradient type for better type safety
export type GradientType = keyof typeof GRADIENT_STYLES;

// Backward compatibility
export const GRADIENT_STYLE = {
  background: GRADIENT_STYLES.primary,
} as const;

// CSS style objects for direct use
export const GRADIENT_CSS = {
  primary: { background: GRADIENT_STYLES.primary },
  primaryAlt: { background: GRADIENT_STYLES.primaryAlt },
  fadeOut: { background: GRADIENT_STYLES.fadeOut },
} as const;

// Utility function to get gradient style
export const getGradientStyle = (type: GradientType) => ({
  background: GRADIENT_STYLES[type],
});

// Utility function to get gradient CSS variable
export const getGradientCSSVar = (type: GradientType) => GRADIENT_STYLES[type];
