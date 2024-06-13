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

import { Icon } from '@ufb/ui';

interface IProps {
  title: string;
}

const LogoWithTitle: React.FC<IProps> = ({ title }) => {
  return (
    <div className="mb-12">
      <div className="mb-2 flex gap-0.5">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={12}
          height={12}
        />
        <Icon name="Title" className="h-[12px] w-[62px]" />
      </div>
      <h1 className="font-24-bold">{title}</h1>
    </div>
  );
};

export default LogoWithTitle;
