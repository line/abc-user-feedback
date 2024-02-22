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
import { useMemo } from 'react';
import type { Toast } from 'react-hot-toast';
import { toast as reactToast } from 'react-hot-toast';

import type { IconNameType } from '../Icon';
import { Icon } from '../Icon';

interface IProps {
  type: 'positive' | 'negative' | 'accent';
  title?: string;
  description?: string;
  iconName?: IconNameType;
  t: Toast;
}

export const ToastBox: React.FC<IProps> = ({
  type,
  description,
  title,
  t,
  iconName,
}) => {
  const bg = useMemo(() => {
    switch (type) {
      case 'negative':
        return 'bg-red-primary';
      case 'positive':
        return 'bg-green-primary';
      case 'accent':
        return 'bg-blue-primary';
      default:
        return '';
    }
  }, [type]);

  const icon = useMemo(() => {
    if (iconName) return iconName;
    switch (type) {
      case 'negative':
        return 'WarningTriangleFill' as const;
      case 'positive':
        return 'CircleCheck' as const;
      case 'accent':
        return 'CircleCheck' as const;
      default:
        return 'CircleCheck' as const;
    }
  }, [type]);

  return (
    <div
      className={`rounded ${bg} flex items-center gap-4 px-5 py-4 text-white`}
    >
      <Icon name={icon} size={24} />
      <div className="min-w-[300px] flex-1">
        {title && <p className="font-16-bold">{title}</p>}
        {description && <p className="font-14-regular mt-1">{description}</p>}
      </div>
      <Icon
        className="cursor-pointer"
        name="Close"
        size={24}
        onClick={() => reactToast.remove(t.id)}
      />
    </div>
  );
};
