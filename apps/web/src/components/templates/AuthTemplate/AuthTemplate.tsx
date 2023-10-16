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
import { Header } from '@/components/layouts';

interface IProps extends React.PropsWithChildren {}

const AuthTemplate: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        <div className="bg-primary border-fill-secondary absolute left-1/2 top-1/2 min-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded border p-10">
          {children}
        </div>
        <p className="font-14-bold text-secondary absolute bottom-[7%] left-1/2 z-10 -translate-x-1/2">
          © ABC Studio All rights reserved
        </p>
      </main>
    </>
  );
};

export default AuthTemplate;
