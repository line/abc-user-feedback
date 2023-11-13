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

import { Icon } from '@ufb/ui';

import { Path } from '@/constants/path';

interface IProps {
  projectId: number;
}

const NoChannel: React.FC<IProps> = ({ projectId }) => {
  const router = useRouter();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <Icon name="WarningTriangleFill" size={56} className="text-tertiary" />
        <p>등록된 Channel이 없습니다.</p>
      </div>
      <button
        className="btn btn-blue btn-lg w-[200px] gap-2"
        onClick={() =>
          router.push({
            pathname: Path.CREATE_CHANNEL,
            query: { projectId },
          })
        }
      >
        <Icon name="Plus" size={24} className="text-above-primary" />
        Channel 생성
      </button>
    </div>
  );
};

export default NoChannel;
