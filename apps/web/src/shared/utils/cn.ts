/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
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
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  const customTwMerge = extendTailwindMerge({
    extend: {
      classGroups: {
        'font-size': [
          'text-title-h1',
          'text-title-h2',
          'text-title-h3',
          'text-title-h4',
          'text-title-h5',
          'text-small-normal',
          'text-small-strong',
          'text-small-underline',
          'text-small-delete',
          'text-base-normal',
          'text-base-strong',
          'text-base-underline',
          'text-base-delete',
          'text-large-normal',
          'text-large-strong',
          'text-large-underline',
          'text-large-delete',
          'text-xlarge-normal',
          'text-xlarge-strong',
          'text-xlarge-underline',
          'text-xlarge-delete',
        ],
      },
    },
  });

  return customTwMerge(clsx(inputs));
}
