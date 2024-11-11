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
import { IconButton } from '@ufb/react';

interface Props extends React.PropsWithChildren {
  title: React.ReactNode;
  action?: React.ReactNode;
  onClickBack?: () => void;
}

const SettingTemplate: React.FC<Props> = (props) => {
  const { title, action, children, onClickBack } = props;
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex min-h-10 items-center justify-between">
        <h4 className="text-title-h4 flex-1">
          {onClickBack && (
            <IconButton
              icon="RiArrowLeftLine"
              variant="ghost"
              onClick={onClickBack}
            />
          )}
          {title}
        </h4>
        <div className="setting-action-buttons flex items-stretch gap-3">
          {action}
        </div>
      </div>
      {children}
    </div>
  );
};

export default SettingTemplate;
