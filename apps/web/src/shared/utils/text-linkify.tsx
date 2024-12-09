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

export const linkify = (text: string): React.ReactNode[] => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.split(urlRegex).reduce((acc, part, index, array) => {
    if (index < array.length - 1) {
      const match = text.match(urlRegex)?.[index];
      return [
        ...acc,
        part,
        <a
          key={index}
          href={match}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-primary underline"
          onClick={(e) => e.stopPropagation()}
        >
          {match}
        </a>,
      ];
    }
    return [...acc, part];
  }, [] as React.ReactNode[]);
};
