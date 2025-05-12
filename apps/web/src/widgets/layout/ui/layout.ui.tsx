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

import { cn } from '@/shared';

import Header from './header.ui';

interface IProps extends React.PropsWithChildren {
  projectId?: number;
  title: string;
  extra?: React.ReactNode;
  isHeightDynamic?: boolean;
}

const Layout: React.FC<IProps> = (props) => {
  const { children, projectId, title, isHeightDynamic, extra } = props;

  return (
    <>
      <Header projectId={projectId} />
      <main className="flex flex-col gap-3 p-5">
        <div className="h-10">
          <div className="flex h-8 items-center gap-3 px-3">
            <h1 className="text-title-h3">{title}</h1>
            {extra}
          </div>
        </div>
        <div
          className={cn({
            'h-[calc(100vh-160px)]': !isHeightDynamic,
            'min-h-[calc(100vh-160px)]': isHeightDynamic,
          })}
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
