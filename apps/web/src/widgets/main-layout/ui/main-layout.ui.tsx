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
import { useRouter } from 'next/router';

import { LocaleSelectBox, Logo, Path } from '@/shared';
import { ThemeToggleButton } from '@/entities/theme';
import { UserBox } from '@/entities/user';

import Breadcrumb from './breadcrumb';
import SideNav from './side-nav.ui';

interface IProps extends React.PropsWithChildren {
  center?: boolean;
}

const MainLayout: React.FC<IProps> = (props) => {
  const { children, center } = props;

  const router = useRouter();

  return (
    <div className="min-w-[960px]">
      <header className="relative flex h-[48px] items-center justify-between px-4">
        <div className="flex flex-1 items-center gap-6">
          <Logo />
          <Breadcrumb />
        </div>
        <div className="flex items-center gap-2 self-stretch">
          <UserBox />
          <LocaleSelectBox />
          <ThemeToggleButton />
        </div>
      </header>
      {center ?
        <>
          <div className="bg-primary border-fill-secondary absolute left-1/2 top-1/2 min-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded border p-8">
            {children}
          </div>
          <footer className="font-14-bold text-secondary absolute bottom-[7%] left-1/2 z-10 -translate-x-1/2">
            © ABC Studio All rights reserved
          </footer>
        </>
      : <div className="flex min-h-[calc(100vh-48px)] items-stretch">
          {Path.hasSideNav(router.pathname) && <SideNav />}
          <main className="mx-4 my-6 w-full overflow-x-auto">{children}</main>
        </div>
      }
    </div>
  );
};

export default MainLayout;
