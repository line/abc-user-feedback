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
import { cn } from '@/shared';

interface IProps extends React.PropsWithChildren {
  title: string | React.ReactNode;
  actionBtn?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  action?: React.ReactNode;
}

const SettingMenuTemplate: React.FC<IProps> = (props) => {
  const { title, actionBtn, children, action } = props;

  return (
    <div className="border-fill-tertiary relative flex h-[calc(100vh-152px)] min-w-[300px] flex-col gap-6 overflow-auto rounded border p-6">
      <div className="flex h-10 items-center justify-between">
        {typeof title === 'string' ?
          <h1 className="font-20-bold">{title}</h1>
        : title}
        {actionBtn && (
          <button
            {...actionBtn}
            className={cn([
              'btn btn-md btn-primary min-w-[120px]',
              actionBtn.className,
            ])}
          />
        )}
        {action}
      </div>
      <hr className="border-fill-tertiary" />
      {children}
    </div>
  );
};

export default SettingMenuTemplate;
