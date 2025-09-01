/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useOAIQuery } from '../lib';

interface Props {
  url: string;
}

const FeedbackImage = ({ url }: Props) => {
  const router = useRouter();
  const projectId = Number(router.query.projectId);
  const channelId = Number(router.query.channelId);

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
    queryOptions: {
      enabled:
        router.isReady &&
        Number.isFinite(projectId) &&
        Number.isFinite(channelId),
    },
  });

  const imageKey = useMemo(() => {
    if (!channelData?.imageConfig?.enablePresignedUrlDownload) return '';

    const s3Pattern = /(s3[.-][a-z0-9-]+\.amazonaws\.com|s3\.amazonaws\.com)/;
    if (!s3Pattern.test(url)) return '';

    const parsedUrl = new URL(url);
    const key = decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ''));
    const host = parsedUrl.hostname;

    const parts = key.split('/', 2);
    if (
      (host === 's3.amazonaws.com' || host.startsWith('s3.')) &&
      parts.length >= 2
    ) {
      return parts.slice(1).join('/');
    }

    return key;
  }, [channelData, url]);

  const { data: presignedUrl } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}/image-download-url',
    variables: { channelId, projectId, imageKey },
    queryOptions: {
      enabled: Boolean(
        imageKey && channelData?.imageConfig?.enablePresignedUrlDownload,
      ),
    },
  });

  return (
    <Image
      src={presignedUrl ?? url}
      alt={presignedUrl ?? url}
      className="cursor-pointer object-cover"
      fill
    />
  );
};

export default FeedbackImage;
