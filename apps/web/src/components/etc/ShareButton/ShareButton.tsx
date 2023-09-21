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
import { Icon, toast } from '@ufb/ui';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  id: number;
  pathname: string;
}

const ShareButton: React.FC<IProps> = ({ id, pathname }) => {
  const { t } = useTranslation();

  const onClickLinkCopy: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    try {
      const { origin } = window.location;
      navigator.clipboard.writeText(`${origin}${pathname}?id=${id}`);
      toast.positive({ title: t('toast.copy'), iconName: 'CopyFill' });
    } catch (error) {
      toast.negative({ title: 'fail' });
    }
  };

  return (
    <button
      className="icon-btn icon-btn-tertiary icon-btn-sm"
      onClick={onClickLinkCopy}
    >
      <Icon name="Share" />
    </button>
  );
};

export default ShareButton;
