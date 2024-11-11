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
import { Button } from '@ufb/react';

import { cn } from '@/shared';

interface IProps extends React.PropsWithChildren {
  title: React.ReactNode;
  action?: React.ReactNode;
  actionBtn?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

const SettingMenuTemplate: React.FC<IProps> = (props) => {
  const { title, actionBtn, children, action } = props;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex min-h-10 items-center justify-between">
        <h4 className="text-title-h4 flex-1">{title}</h4>
        {actionBtn && (
          <Button
            {...actionBtn}
            className={cn(['min-w-[120px]', actionBtn.className])}
          />
        )}
        <div className="setting-action-buttons flex">{action}</div>
      </div>
      {children}
    </div>
  );
};

export default SettingMenuTemplate;
