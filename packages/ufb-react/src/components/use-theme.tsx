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
import type { Radius, Size } from "../types";

const DefaultValue: {
  themeSize: Size;
  themeRadius: Radius;
} = {
  themeSize: "small",
  themeRadius: "medium",
} as const;

const useTheme = () => {
  if (typeof window !== "undefined") {
    const size = (document.body.getAttribute("data-size") ??
      DefaultValue.themeSize) as Size;
    const radius = (document.body.getAttribute("data-radius") ??
      DefaultValue.themeRadius) as Radius;
    return { themeSize: size, themeRadius: radius };
  } else {
    return DefaultValue;
  }
};

export default useTheme;
