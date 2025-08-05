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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useOverlay } from '@toss/use-overlay';

import { WarnIfUnsavedChangesDialog } from '../ui';

const useWarnIfUnsavedChanges = (
  hasUnsavedChanges: boolean,
  excludePath?: string,
) => {
  const router = useRouter();
  const overlay = useOverlay();
  const [isLoading, setIsLoading] = useState(false);

  const openWarnIfUnsavedChangesDialog = (url: string) => {
    overlay.open(({ isOpen, close }) => (
      <WarnIfUnsavedChangesDialog
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

  // close and refresh page
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = ''; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // back button and route change
  useEffect(() => {
    const handleBeforeChangeRoute = (url: string) => {
      if (excludePath && url.includes(excludePath)) return;

      if (!hasUnsavedChanges || isLoading) return;
      openWarnIfUnsavedChangesDialog(url);

      router.events.emit('routeChangeError');
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw 'routeChange aborted.';
    };
    router.events.on('routeChangeStart', handleBeforeChangeRoute);

    return () => {
      router.events.off('routeChangeStart', handleBeforeChangeRoute);
    };
  }, [hasUnsavedChanges, isLoading]);
};

export default useWarnIfUnsavedChanges;
