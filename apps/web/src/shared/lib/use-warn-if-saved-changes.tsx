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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useOverlay } from '@toss/use-overlay';

import { WarnIfSavedChangesDialog } from '../ui';

const useWarnIfSavedChanges = (
  hasSavedChanges: boolean,
  excludePath: string,
) => {
  const router = useRouter();
  const overlay = useOverlay();
  const [isLoading, setIsLoading] = useState(false);

  const openWarnIfSavedChangesDialog = (url: string) => {
    overlay.open(({ isOpen, close }) => (
      <WarnIfSavedChangesDialog
        isOpen={isOpen}
        close={close}
        onSubmit={async () => {
          try {
            setIsLoading(true);
            await router.push(url);
          } finally {
            setIsLoading(false);
            close();
          }
        }}
      />
    ));
  };

  // 닫기, 새로고침
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasSavedChanges) {
        event.preventDefault();
        event.returnValue = ''; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasSavedChanges]);

  // Browser 뒤로가기, 나가기 버튼
  useEffect(() => {
    const handleBeforeChangeRoute = (url: string) => {
      if (url.includes(excludePath)) return;
      if (!hasSavedChanges || isLoading) return;
      openWarnIfSavedChangesDialog(url);

      router.events.emit('routeChangeError');
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw 'routeChange aborted.';
    };
    router.events.on('routeChangeStart', handleBeforeChangeRoute);

    return () => {
      router.events.off('routeChangeStart', handleBeforeChangeRoute);
    };
  }, [hasSavedChanges, isLoading]);
};

export default useWarnIfSavedChanges;
