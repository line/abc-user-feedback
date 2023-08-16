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
import { Toast } from 'react-hot-toast';
import { toast as reactToast } from 'react-hot-toast';

import { Icon, IconNameType } from '../Icon';

export interface IToastInfoBoxProps {
  t: Toast;
  closeable?: boolean;
  title: string;
  description?: string;
  status: 'loading' | 'success' | 'error';
  theme: 'light' | 'dark';
}

export const ToastPromiseBox: React.FC<IToastInfoBoxProps> = ({
  title,
  t,
  closeable,
  status,
  description,
  theme,
}) => {
  const { iconName, color } = useMemo((): {
    iconName: IconNameType;
    color: string;
  } => {
    switch (status) {
      case 'loading':
        return {
          iconName: theme === 'dark' ? 'LoadingDark' : 'LoadingLight',
          color: '',
        };
      case 'success':
        return { iconName: 'CircleCheck', color: 'text-green-primary' };
      case 'error':
        return { iconName: 'WarningCircleFill', color: 'text-red-primary' };
      default:
        return { iconName: 'CircleCheck', color: 'text-green-primary' };
    }
  }, [status]);

  return (
    <div className="rounded px-5 py-4 flex items-center gap-4 bg-tertiary border border-fill-secondary ">
      <Icon
        name={iconName}
        size={24}
        className={[color, status === 'loading' ? 'animate-spin' : ''].join(
          ' ',
        )}
      />
      <div className="flex-1 min-w-[300px]">
        <p className="font-16-bold">{title}</p>
        {description && <p className="font-14-regular mt-1">{description}</p>}
      </div>
      {closeable && (
        <Icon
          className="cursor-pointer"
          name="Close"
          size={24}
          onClick={() => reactToast.remove(t.id)}
        />
      )}
    </div>
  );
};
