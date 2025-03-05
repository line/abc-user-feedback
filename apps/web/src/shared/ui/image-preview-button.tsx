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

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
  Icon,
  Tag,
} from '@ufb/react';

import { cn } from '@/shared';

interface IProps {
  urls: string[];
}

const ImagePreviewButton: React.FC<IProps> = (props) => {
  const { urls } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  useEffect(() => {
    if (!open) setThumbsSwiper(null);
  }, [open]);

  if (urls.length === 0) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tag
          variant="outline"
          size="small"
          className={cn('cursor-pointer gap-1')}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <Icon name="RiImageFill" size={12} />
          Image
        </Tag>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()} className="max-w-fit">
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
          >
            {urls.map((url) => (
              <SwiperSlide key={url}>
                <Image
                  src={url}
                  alt={url}
                  fill
                  onClick={() => window.open(url, '_blank')}
                  className="cursor-pointer object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbnail-swiper"
          >
            {urls.map((url) => (
              <SwiperSlide key={url} className="rounded-8 overflow-hidden">
                <Image
                  src={url}
                  alt={url}
                  fill
                  className="cursor-pointer object-cover"
                />
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

export default ImagePreviewButton;
