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
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { Icon, Popover, PopoverContent, PopoverTrigger } from '@ufb/ui';

import { useUser } from '@/contexts/user.context';

interface IProps {}

const ProfileBox: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { user, signOut } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClickProfile = () => {
    router.push('/main/profile');
    setOpen(false);
  };

  const handleClickSignout = () => {
    signOut();
    setOpen(false);
  };

  if (!user) return <></>;
  return (
    <div className="relative h-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="h-full" onClick={() => setOpen((v) => !v)}>
          <div
            className={[
              'flex h-full cursor-pointer items-center gap-3 px-3',
              open ? 'bg-fill-quaternary' : '',
            ].join(' ')}
          >
            <div className="flex items-center gap-2">
              <Icon name="ProfileCircleFill" size={16} />
              <p className="font-12-regular">{user?.email}</p>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <ul>
            <li
              className="hover:bg-fill-quaternary cursor-pointer p-3 hover:cursor-pointer"
              onClick={handleClickProfile}
            >
              {t('header.profile')}
            </li>
            <li
              className="hover:bg-fill-quaternary cursor-pointer p-3 hover:cursor-pointer"
              onClick={handleClickSignout}
            >
              {t('header.sign-out')}
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProfileBox;
