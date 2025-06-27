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
