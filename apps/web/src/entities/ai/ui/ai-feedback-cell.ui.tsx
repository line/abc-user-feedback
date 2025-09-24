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

import { memo } from 'react';

import { Icon } from '@ufb/react';

import { LoadingBars } from '@/features/update-ai-setting/ui/playground-output-card.ui';

interface Props {
  value:
    | { status: 'loading' | 'success' | 'error'; message: string }
    | undefined;
  isLoading?: boolean;
}
const AICell = memo((props: Props) => {
  const { value, isLoading } = props;

  if (!value) return null;

  return (
    <>
      {value.status === 'loading' || isLoading ?
        <LoadingBars width={410} />
      : value.status === 'error' ?
        <div className="text-tint-red">
          <Icon name="RiErrorWarningFill" className="mr-2" size={16} />
          <span>{value.message}</span>
        </div>
      : <p>{value.message}</p>}
    </>
  );
});
export default AICell;
