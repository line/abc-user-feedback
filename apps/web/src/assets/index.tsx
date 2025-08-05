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

import Image from 'next/image';

type ImageProps = Omit<
  React.ComponentPropsWithoutRef<typeof Image>,
  'src' | 'alt'
>;

export const NodataImage = (props: ImageProps) => {
  return (
    <Image
      src="/assets/images/no-data.svg"
      alt="noData"
      width={200}
      height={200}
      {...props}
    />
  );
};

export const NoDataWithSearchImage = (props: ImageProps) => {
  return (
    <Image
      src="/assets/images/no-data-with-search.svg"
      alt="no-data-with-search"
      width={200}
      height={200}
      {...props}
    />
  );
};
export const WatingImage = (props: ImageProps) => {
  return (
    <Image
      src="/assets/images/waiting.svg"
      alt="wating"
      width={200}
      height={200}
      {...props}
    />
  );
};
export const OpenAIIcon = (props: ImageProps) => {
  return (
    <Image
      src="/assets/images/openai-fill.svg"
      alt="openai-icon"
      width={24}
      height={24}
      {...props}
    />
  );
};

export const GeminiIcon = (props: ImageProps) => {
  return (
    <Image
      src="/assets/images/gemini-fill.svg"
      alt="gemini-icon"
      width={24}
      height={24}
      {...props}
    />
  );
};

export const AISparklingIcon = (props: ImageProps) => {
  return (
    <Image
      src="/assets/images/ai-sparkling-fill.svg"
      alt="ai-sparkling-fill"
      width={16}
      height={16}
      {...props}
    />
  );
};
export const AIGenerateIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 3.59961H12.4004V4.40039H6C4.56406 4.40039 3.40039 5.56406 3.40039 7V17C3.40039 18.436 4.56406 19.5996 6 19.5996H18C19.436 19.5996 20.5996 18.436 20.5996 17V12.5996H21.4004V17C21.4004 18.8777 19.8777 20.4004 18 20.4004H6C4.12223 20.4004 2.59961 18.8777 2.59961 17V7C2.59961 5.12223 4.12223 3.59961 6 3.59961ZM19.1973 2.59961C19.4547 4.24564 20.7544 5.54527 22.4004 5.80273V6.19629C20.7543 6.4537 19.4547 7.75432 19.1973 9.40039H18.8027C18.5453 7.75432 17.2457 6.4537 15.5996 6.19629V5.80273C17.2456 5.54527 18.5453 4.24564 18.8027 2.59961H19.1973Z"
        fill="url(#paint0_linear_12996_14077)"
        stroke="url(#paint1_linear_12996_14077)"
        stroke-width="1.2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_12996_14077"
          x1="12.5"
          y1="2"
          x2="12.5"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2DD4BF" />
          <stop offset="1" stop-color="#0EA5E9" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_12996_14077"
          x1="12.5"
          y1="2"
          x2="12.5"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2DD4BF" />
          <stop offset="1" stop-color="#0EA5E9" />
        </linearGradient>
      </defs>
    </svg>
  );
};
