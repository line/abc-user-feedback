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

import { useTranslation } from 'next-i18next';

import { Button, Icon, toast } from '@ufb/react';

interface Props {
  data: string;
}

const CopyIconButton: React.FC<Props> = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  return (
    <Button
      variant="ghost"
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(data);
          toast(t('v2.toast.copy'), {
            icon: <Icon name="RiCheckboxMultipleFill" />,
          });
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <Icon name="RiLinkM" size={16} className="cursor-pointer" />
    </Button>
  );
};

export default CopyIconButton;
