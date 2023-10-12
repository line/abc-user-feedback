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
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from 'zustand';

import { Icon } from '@ufb/ui';

import { Path } from '@/constants/path';
import themeStore from '@/zustand/theme.store';
import HeaderName from './HeaderName';
import LocaleSelectBox from './LocaleSelectBox';
import ProfileBox from './ProfileBox';

const Header: React.FC = () => {
  const router = useRouter();

  const { theme, toggle } = useStore(themeStore);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <header className="bg-primary relative flex h-[48px] items-center justify-between px-4">
      <div className="flex flex-1 items-center gap-6">
        <Link
          className="flex cursor-pointer items-center gap-1"
          href={Path.isProtectPage(router.pathname) ? Path.MAIN : Path.SIGN_IN}
        >
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={24}
            height={24}
          />
          <Icon name="Title" className="h-[24px] w-[123px]" />
        </Link>
        <HeaderName />
      </div>
      <div className="flex items-center gap-2 self-stretch">
        <ProfileBox />
        <LocaleSelectBox />
        <button
          className="icon-btn icon-btn-sm icon-btn-secondary"
          onClick={() => toggle()}
        >
          <Icon
            name={theme === 'light' ? 'MoonStroke' : 'SunStroke'}
            className="text-primary"
          />
        </button>
      </div>
    </header>
  );
};
export default Header;
