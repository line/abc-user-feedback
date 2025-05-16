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
import { useRouter } from 'next/router';
import { useOverlay } from '@toss/use-overlay';

import { CreatingDialog, Path } from '@/shared';
import { useCreateChannelStore } from '@/features/create-channel';

const useRoutingChannelCreation = (projectId: number) => {
  const { editingStepIndex, reset, jumpStepByIndex } = useCreateChannelStore();
  const overlay = useOverlay();
  const router = useRouter();

  const openChannelInProgress = async () => {
    if (editingStepIndex !== null) {
      await new Promise<boolean>((resolve) =>
        overlay.open(({ close, isOpen }) => (
          <CreatingDialog
            isOpen={isOpen}
            close={close}
            type="Channel"
            onRestart={() => {
              reset();
              resolve(true);
            }}
            onContinue={() => {
              jumpStepByIndex(editingStepIndex);
              resolve(true);
            }}
          />
        )),
      );
    }
    await router.push({ pathname: Path.CREATE_CHANNEL, query: { projectId } });
  };

  const isCreatingChannel = editingStepIndex !== null;
  return {
    openChannelInProgress,
    isCreatingChannel,
  };
};

export default useRoutingChannelCreation;
