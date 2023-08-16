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

import { Header, SideNav } from '@/components/layouts';
import { Path } from '@/constants/path';

interface IProps extends React.PropsWithChildren {}

const MainTemplate: React.FC<IProps> = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <Header />
      <div className="flex items-stretch min-h-[calc(100vh-48px)]">
        {Path.hasSideNav(router.pathname) && <SideNav />}
        {/* <main className="flex flex-col mx-4 my-6 w-[calc(100vw-120px)]"> */}
        <main
          className={[
            'flex flex-col mx-4 my-6',
            Path.hasSideNav(router.pathname)
              ? 'w-[calc(100%-104px)] '
              : 'w-full',
          ].join(' ')}
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default MainTemplate;
