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
  const urlRegex =
    /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex) ?? [];
  const result: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    result.push(part);
    if (index < matches.length) {
      result.push(
        <a
          key={index}
          href={matches[index]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-primary underline"
          onClick={(e) => e.stopPropagation()}
        >
          {matches[index]}
        </a>,
      );
    }
  });

  return result;
};
