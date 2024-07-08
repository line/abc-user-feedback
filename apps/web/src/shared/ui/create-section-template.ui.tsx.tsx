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
import { useState } from 'react';

import { Icon } from '@ufb/ui';

import { cn } from '../utils';

interface IProps extends React.PropsWithChildren {
  title: string;
  defaultOpen?: boolean;
}

const CreateSectionTemplate: React.FC<IProps> = ({
  title,
  children,
  defaultOpen,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-fill-tertiary overflow-hidden rounded-sm border">
      <div
        className="bg-fill-quaternary flex cursor-pointer items-center justify-between px-6 py-3"
        onClick={() => setOpen((prev) => !prev)}
      >
        <p className="font-14-bold">{title}</p>
        <button className="icon-btn icon-btn-sm icon-btn-tertiary icon-btn-rounded">
          <Icon
            name="ChevronDown"
            className={cn([
              'transform transition-transform',
              open ? 'rotate-180' : 'rotate-0',
            ])}
          />
        </button>
      </div>
      <div
        className={cn([
          'flex flex-col gap-5',
          open ? 'visible h-fit p-6' : 'hidden min-h-0',
        ])}
      >
        {children}
      </div>
    </div>
  );
};

export default CreateSectionTemplate;
