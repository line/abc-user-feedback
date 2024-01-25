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
import { Toaster as HotToaster, toast as reactToast } from 'react-hot-toast';

import type { IconNameType } from '../Icon';
import { ToastBox } from './ToastBox';
import type { IToastInfoBoxProps } from './ToastPromiseBox';
import { ToastPromiseBox } from './ToastPromiseBox';

interface IToastProps {
  title?: string;
  description?: string;
  iconName?: IconNameType;
}

export const toast = {
  positive: (input: IToastProps) =>
    reactToast.custom((t) => <ToastBox type="positive" {...input} t={t} />),
  negative: (input: IToastProps) =>
    reactToast.custom((t) => <ToastBox type="negative" {...input} t={t} />),
  accent: (input: IToastProps) =>
    reactToast.custom((t) => <ToastBox type="accent" {...input} t={t} />),
  promise: async (
    fn: Promise<any>,
    input: {
      title: { success: string; loading: string; error: string };
      description?: { success?: string; loading?: string; error?: string };
    },
    theme: 'light' | 'dark' = 'light',
    option?: Omit<IToastInfoBoxProps, 't' | 'title' | 'status'>,
  ) => {
    const { title, description } = input;
    const id = reactToast.custom(
      (t) => (
        <ToastPromiseBox
          {...option}
          t={t}
          status="loading"
          title={title.loading}
          description={description?.loading}
          theme={theme}
        />
      ),
      { duration: Infinity },
    );
    fn.then(() => {
      reactToast.custom(
        (t) => (
          <ToastPromiseBox
            {...option}
            t={t}
            status="success"
            title={title.success}
            description={description?.success}
            theme={theme}
            closeable
          />
        ),
        { id, duration: 4000 },
      );
    }).catch(() => {
      reactToast.custom(
        (t) => (
          <ToastPromiseBox
            {...option}
            t={t}
            status="error"
            title={title.error}
            description={description?.error}
            theme={theme}
            closeable
          />
        ),
        { id, duration: 4000 },
      );
    });

    return fn;
  },
};
export const Toaster = () => <HotToaster position="bottom-center" />;
