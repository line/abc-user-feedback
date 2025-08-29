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

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ufb/react';

import { useOAIQuery } from '@/shared';

interface IProps extends React.PropsWithChildren {
  urls: string[];
  initialIndex?: number;
}

const ImagePreviewButton: React.FC<IProps> = (props) => {
  const { urls, children, initialIndex } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (!open) setThumbsSwiper(null);
  }, [open]);

  useEffect(() => {
    if (!thumbsSwiper || !open) return;
    thumbsSwiper.slideTo(initialIndex ?? 0);
  }, [thumbsSwiper, open, initialIndex]);

  if (urls.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-fit" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t('modal.image-preview.title')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="main-swiper"
            initialSlide={initialIndex ?? 0}
          >
            {urls.map((url) => (
              <SwiperSlide key={url} className="relative">
                <PresignedURLImage url={url} />
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbnail-swiper"
          >
            {urls.map((url) => (
              <SwiperSlide
                key={url}
                className="rounded-8 bg-neutral-secondary relative overflow-hidden"
              >
                <PresignedURLImage url={url} />
              </SwiperSlide>
            ))}
          </Swiper>
        </DialogBody>
        <DialogFooter>
          <DialogClose>{t('v2.button.cancel')}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
interface IPresignedURLImageProps {
  url: string;
}
const PresignedURLImage = ({ url }: IPresignedURLImageProps) => {
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
    if (!channelData?.imageConfig?.enablePresignedUrlDownload) {
      return url;
    }

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
      fill
      className="cursor-pointer object-cover"
    />
  );
};

export default ImagePreviewButton;
