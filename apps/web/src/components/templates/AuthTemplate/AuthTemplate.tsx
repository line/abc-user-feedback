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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary border border-fill-secondary rounded p-10 min-w-[440px]">
          {children}
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 bottom-[7%] z-10 font-14-bold text-secondary">
          © ABC Studio All rights reserved
        </p>
      </main>
    </>
  );
};

export default AuthTemplate;
