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
import type { UrlObject } from 'url';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import type { IconNameType } from '@ufb/ui';
import { Icon } from '@ufb/ui';

import { cn, Path } from '@/shared';

interface IProps extends React.PropsWithChildren {}

const SideNav: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const projectId = Number(router.query.projectId);
  const ref = useRef<HTMLDivElement>(null);

  const [isHover, setIsHover] = useState(false);

  return (
    <nav className="relative" ref={ref}>
      <div className="h-full w-[72px]" />
      <ul
        className="absolute left-0 top-0 z-20 h-full space-y-1 p-4"
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
        style={{
          backgroundColor: 'var(--body-background-color)',
          width: isHover ? 200 : 'max-content',
        }}
      >
        <MenuItem
          href={{ pathname: Path.DASHBOARD, query: { projectId } }}
          iconName="PerformanceSalesStroke"
          activePathname={Path.DASHBOARD}
          isHover={isHover}
          text={t('main.dashboard.title')}
        />
        <hr />
        <MenuItem
          href={{ pathname: Path.FEEDBACK, query: { projectId } }}
          iconName="BubbleDotsStroke"
          activePathname={Path.FEEDBACK}
          isHover={isHover}
          text={t('main.feedback.title')}
        />
        <MenuItem
          href={{ pathname: Path.ISSUE, query: { projectId } }}
          iconName="DocumentStroke"
          activePathname={Path.ISSUE}
          isHover={isHover}
          text={t('main.issue.title')}
        />
        <hr />
        <MenuItem
          href={{
            pathname: Path.SETTINGS,
            query: { projectId },
          }}
          iconName="SettingStroke"
          activePathname={Path.SETTINGS}
          isHover={isHover}
          text={t('main.setting.title')}
        />
      </ul>
    </nav>
  );
};
interface IMenuItemProps {
  href: UrlObject;
  iconName: IconNameType;
  activePathname: string;
  disabled?: boolean;
  text: string;
  isHover: boolean;
}

const MenuItem: React.FC<IMenuItemProps> = ({
  href,
  iconName,
  activePathname,
  disabled,
  text,
  isHover,
}: IMenuItemProps) => {
  const router = useRouter();
  return (
    <li>
      {disabled ?
        <button
          disabled
          className={cn([
            'icon-btn icon-btn-tertiary icon-btn-md w-full justify-start',
            activePathname === router.pathname ? 'bg-fill-tertiary' : '',
          ])}
        >
          <Icon name={iconName} />
          <span className={cn(['ml-2', isHover ? 'visible' : 'hidden'])}>
            {text}
          </span>
        </button>
      : <Link href={href}>
          <button
            className={cn([
              'icon-btn icon-btn-tertiary icon-btn-md w-full flex-nowrap justify-start',
              {
                'bg-fill-tertiary font-bold':
                  activePathname === router.pathname,
              },
            ])}
          >
            <Icon name={iconName} />
            <span className={cn(['ml-2', isHover ? 'visible' : 'hidden'])}>
              {text}
            </span>
          </button>
        </Link>
      }
    </li>
  );
};

export default SideNav;
