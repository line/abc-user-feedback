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
import Image from 'next/image';

import { Icon } from '@ufb/react';

import { useTenantStore } from '@/entities/tenant';

interface Props extends React.PropsWithChildren {
  title: string;
  image: string;
}

const AnonymousTemplate = (props: Props) => {
  const { title, children, image } = props;
  const { tenant } = useTenantStore();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex items-stretch justify-center gap-4">
        <div className="border-neutral-tertiary flex w-[520px] flex-col gap-10 rounded border p-8">
          <div className="flex h-[54px] justify-between">
            <p className="text-xlarge-strong">{title}</p>
            {tenant && (
              <span>
                <Icon name="RiBuildingLine" size={16} />
                <span className="ml-1">{tenant.siteName}</span>
              </span>
            )}
          </div>
          {children}
        </div>
        <div className="flex w-[520px] flex-col items-center justify-end">
          <img src={image} alt="sign-in-image" />
        </div>
      </div>
    </div>
  );
};

export default AnonymousTemplate;
