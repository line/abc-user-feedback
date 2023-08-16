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
interface IProps extends React.PropsWithChildren {
  title: string | React.ReactNode;
  actionBtn?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  action?: React.ReactNode;
}

const SettingMenuTemplate: React.FC<IProps> = (props) => {
  const { title, actionBtn, children, action } = props;
  return (
    <div className="relative p-6 border border-fill-tertiary rounded h-[calc(100vh-152px)] flex flex-col gap-6 min-w-[300px] overflow-auto">
      <div className="flex justify-between items-center h-10">
        {typeof title === 'string' ? (
          <h1 className="font-20-bold">{title}</h1>
        ) : (
          title
        )}
        {actionBtn && (
          <button
            {...actionBtn}
            className={[
              'btn btn-md btn-primary min-w-[120px]',
              actionBtn.className ?? '',
            ].join(' ')}
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
