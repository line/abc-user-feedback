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

import { Button, Icon } from '@ufb/react';

import Header from './header.ui';

interface Props extends React.PropsWithChildren {}

const AnonymousLayout = (props: Props) => {
  const { children } = props;
  return (
    <div className="flex h-screen min-w-[960px] flex-col">
      <Header />
      <main className="flex-1 p-5">{children}</main>
      <footer className="flex justify-end gap-1 px-6 py-2">
        <Button variant="ghost" disabled>
          <Icon name="RiEarthFill" />
        </Button>
        <a href="https://github.com/line/abc-user-feedback" target="_blank">
          <Button variant="ghost">
            <Icon name="RiGithubFill" />
          </Button>
        </a>
        <a href="mailto:dl_abc_userfeedback@linecorp.com" target="_blank">
          <Button variant="ghost">
            <Icon name="RiMailLine" />
          </Button>
        </a>
      </footer>
    </div>
  );
};

export default AnonymousLayout;
