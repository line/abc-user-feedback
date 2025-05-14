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
import CreationHeader from './creation-header.ui';

interface Props {
  children: React.ReactNode;
  onClickGoBack?: () => void;
  title: string;
  leftPanel: React.ReactNode;
  leftBottom?: React.ReactNode;
}

const CreationLayout: React.FC<Props> = (props) => {
  const { children, onClickGoBack, title, leftPanel, leftBottom } = props;

  return (
    <>
      <CreationHeader onClickGoBack={onClickGoBack} />
      <div className="flex h-full gap-8 p-6">
        <div className="flex w-[520px] flex-shrink-0 flex-col p-6">
          <div className="flex-1">
            <h2 className="text-title-h2 mb-6">{title}</h2>
            {leftPanel}
          </div>
          {leftBottom}
        </div>
        {children}
      </div>
    </>
  );
};

export default CreationLayout;
