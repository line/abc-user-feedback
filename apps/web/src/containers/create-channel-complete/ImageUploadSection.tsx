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

import { useTranslation } from 'react-i18next';

import { Badge, Input } from '@ufb/ui';

import { CreateSectionTemplate } from '@/components/templates/CreateSectionTemplate';
import type { InputImageConfigType } from '@/types/channel.type';

interface IProps extends InputImageConfigType {}

const ImageUploadSection: React.FC<IProps> = ({
  accessKeyId,
  bucket,
  endpoint,
  region,
  secretAccessKey,
  domainWhiteList,
}) => {
  const { t } = useTranslation();

  return (
    <CreateSectionTemplate title={t('channel-setting-menu.image-mgmt')}>
      <div className="flex flex-col gap-2">
        <h2 className="font-20-bold pb-1">
          {t('title-box.image-storage-integration')}
        </h2>
        <Input label="Access Key ID" value={accessKeyId} disabled />
        <Input label="Secret Access Key" value={secretAccessKey} disabled />
        <Input label="End Point" value={endpoint} disabled />
        <Input label="Region" value={region} disabled />
        <Input label="Bucket Name" value={bucket} disabled />
      </div>
      <div>
        <h2 className="font-20-bold pb-3">Image URL Domain Whitelist</h2>
        {domainWhiteList && (
          <div className="flex items-center gap-2">
            {domainWhiteList.map((domain, index) => (
              <Badge key={index} type="secondary">
                {domain}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </CreateSectionTemplate>
  );
};

export default ImageUploadSection;
