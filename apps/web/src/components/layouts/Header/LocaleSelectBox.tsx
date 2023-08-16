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
import { Listbox } from '@headlessui/react';
import { Icon } from '@ufb/ui';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

interface IProps extends React.PropsWithChildren {}

const LocaleSelectBox: React.FC<IProps> = () => {
  const router = useRouter();
  const onToggleLanguageClick = useCallback(
    (newLocale: string) => {
      const { pathname, asPath, query } = router;
      setCookie('NEXT_LOCALE', newLocale);
      router.push({ pathname, query }, asPath, { locale: newLocale });
    },
    [router],
  );

  return (
    <Listbox
      as="div"
      className="relative"
      value={router.locale}
      onChange={(v) => onToggleLanguageClick(v)}
    >
      <Listbox.Button className="btn btn-sm btn-secondary px-2 min-w-0">
        {({ value }) => (
          <>
            <Icon name="GlobeStroke" size={16} className="mr-1" />
            <span className="font-12-bold uppercase">{value}</span>
          </>
        )}
      </Listbox.Button>
      <Listbox.Options className="absolute bg-primary w-full mt-1 z-10 rounded border">
        {router.locales
          ?.filter((v) => v !== 'default')
          .map((v) => (
            <Listbox.Option
              key={v}
              value={v}
              className={({ selected }) =>
                [
                  'select-none p-2 cursor-pointer hover:bg-secondary uppercase text-center font-extrabold',
                  selected ? 'font-bold' : 'font-normal',
                ].join(' ')
              }
            >
              {v}
            </Listbox.Option>
          ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default LocaleSelectBox;
