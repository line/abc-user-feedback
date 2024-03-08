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

import { ThemeToggleButton } from '@/components/buttons';
import HeaderName from './HeaderName';
import LocaleSelectBox from './LocaleSelectBox';
import Logo from './Logo';
import ProfileBox from './ProfileBox';

const Header: React.FC = () => {
  return (
    <header className="relative flex h-[48px] items-center justify-between px-4">
      <div className="flex flex-1 items-center gap-6">
        <Logo />
        <HeaderName />
      </div>
      <div className="flex items-center gap-2 self-stretch">
        <ProfileBox />
        <LocaleSelectBox />
        <ThemeToggleButton />
      </div>
    </header>
  );
};

export default Header;
