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
import { Icon, IconNameType } from '@ufb/ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UrlObject } from 'url';

import { Path } from '@/constants/path';
import { useCurrentProjectId, usePermissions } from '@/hooks';

interface IProps extends React.PropsWithChildren {}

const SideNav: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { projectId } = useCurrentProjectId();

  const perms = usePermissions(projectId);
  const ref = useRef<HTMLDivElement>(null);

  const [isHover, setIsHover] = useState(false);

  return (
    <nav className="relative" ref={ref}>
      <div className="w-[72px] h-full" />
      <ul
        className="absolute left-0 top-0 bg-fill-inverse z-20 h-full p-4 space-y-1"
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
        style={{
          width: isHover ? 200 : 'max-content',
          boxShadow: isHover ? '4px 4px 8px 0px #0000000F' : '',
        }}
      >
        <MenuItem
          href={{
            pathname: Path.FEEDBACK,
            query: { projectId },
          }}
          iconName="BubbleDotsStroke"
          activePathname={Path.FEEDBACK}
          disabled={!perms.includes('feedback_read')}
          isHover={isHover}
          text={t('main.feedback.title')}
        />
        <MenuItem
          href={{
            pathname: Path.ISSUE,
            query: { projectId },
          }}
          iconName="DocumentStroke"
          activePathname={Path.ISSUE}
          disabled={!perms.includes('issue_read')}
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
          disabled={!perms.includes('issue_read')}
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
      {disabled ? (
        <button
          disabled
          className={[
            'icon-btn icon-btn-tertiary icon-btn-md w-full justify-start',
            activePathname === router.pathname ? 'bg-fill-tertiary' : '',
          ].join(' ')}
        >
          <Icon name={iconName} />
          <span className={['ml-2', isHover ? 'visible' : 'hidden'].join(' ')}>
            {text}
          </span>
        </button>
      ) : (
        <Link
          href={href}
          onClick={() => {
            if (activePathname === router.pathname) router.reload();
          }}
        >
          <button
            className={[
              'icon-btn icon-btn-tertiary icon-btn-md w-full justify-start flex-nowrap',
              activePathname === router.pathname
                ? 'bg-fill-tertiary font-bold'
                : '',
            ].join(' ')}
          >
            <Icon name={iconName} />
            <span
              className={['ml-2', isHover ? 'visible' : 'hidden'].join(' ')}
            >
              {text}
            </span>
          </button>
        </Link>
      )}
    </li>
  );
};

export default SideNav;
