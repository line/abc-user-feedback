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

import { useAllProjects } from '@/shared/lib';

import Logo from '../logo.ui';

interface Props {
  onClickGoBack?: () => void;
}

const CreationHeader: React.FC<Props> = ({ onClickGoBack }) => {
  const { data } = useAllProjects();
  return (
    <div className="flex h-12 items-center justify-between p-6">
      <Logo />
      {onClickGoBack && data?.meta.totalItems !== 0 && (
        <Button variant="ghost" onClick={onClickGoBack}>
          <Icon name="RiLogoutBoxRLine" />
        </Button>
      )}
    </div>
  );
};

export default CreationHeader;
