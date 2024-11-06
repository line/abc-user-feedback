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
import { Icon } from '@ufb/ui';

import Header from './header.ui';

interface IProps extends React.PropsWithChildren {
  projectId?: number;
  title: string;
}

const Layout: React.FC<IProps> = (props) => {
  const { children, projectId, title } = props;

  return (
    <div>
      <Header projectId={projectId} />
      <main className="p-5">
        <div className="h-20 px-6 py-3">
          <h1 className="text-title-h3">{title}</h1>
        </div>
        {children}
      </main>
      <footer className="bg-neutral-tertiary flex flex-col items-center p-4">
        <div className="flex items-center gap-2">
          <Icon name="LogoBlack" />
          <p className="text-title-h5">ABC User Feedback</p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton variant="ghost" icon="RiEarthFill" />
          <IconButton variant="ghost" icon="RiGithubFill" />
          <IconButton variant="ghost" icon="RiMailLine" />
        </div>
        <div className="text-neutral-tertiary font-normal">
          © 2024 ABC Studio. All rights reserved
        </div>
      </footer>
    </div>
  );
};

export default Layout;
