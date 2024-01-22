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

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, Popover, PopoverContent, PopoverTrigger } from '@ufb/ui';

import { useHorizontalScroll } from '@/hooks';

interface IProps {
  urls: string[];
}

const ImagePreviewButton: React.FC<IProps> = ({ urls }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(urls[0]);

  const {
    containerRef,
    scrollLeft,
    scrollRight,
    showLeftButton,
    showRightButton,
  } = useHorizontalScroll({
    defaultRightButtonShown: urls.length > 7,
    scrollGap: 78,
  });

  if (urls.length === 0) return null;
  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="btn btn-secondary btn-xs btn-rounded gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <Icon name="MediaImageFill" size={12} />
          Image
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="border-fill-secondary flex flex-col gap-5 border p-5"
        onClick={(e) => e.stopPropagation()}
        diabledDimmed
      >
        <div className="flex items-center justify-between">
          <h1 className="font-14-bold">{t('modal.image-preview.title')}</h1>
          <button
            className="icon-btn icon-btn-xs icon-btn-tertiary"
            onClick={() => setOpen(false)}
          >
            <Icon name="Close" />
          </button>
        </div>

        <img
          src={currentImage}
          alt="preview"
          className="bg-fill-quaternary h-full w-full cursor-pointer rounded object-contain"
          onClick={() => window.open(currentImage, '_blank')}
          style={{ width: 580, height: 400 }}
          width={580}
          height={400}
        />
        <div className="relative overflow-hidden">
          <div className="top-0 w-full">
            {showRightButton && (
              <button
                onClick={scrollRight}
                className="icon-btn icon-btn-secondary icon-btn-sm icon-btn-rounded absolute-y-center shadow-floating-depth-2 absolute right-0 z-10"
              >
                <Icon name="ArrowRight" />
              </button>
            )}
            {showLeftButton && (
              <button
                onClick={scrollLeft}
                className="icon-btn icon-btn-secondary icon-btn-sm icon-btn-rounded absolute-y-center shadow-floating-depth-2 absolute left-0 z-10"
              >
                <Icon name="ArrowLeft" />
              </button>
            )}
          </div>
          <div
            className="overflow-hidden"
            style={{ width: 580 }}
            ref={containerRef}
          >
            <div className="relative flex gap-2">
              {urls.map((url) => (
                <div
                  key={url}
                  className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-sm"
                  style={{ width: 70, height: 40 }}
                  onClick={() => setCurrentImage(url)}
                >
                  <img
                    src={url}
                    alt="preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {url === currentImage && (
                    <>
                      <div
                        style={{ background: 'var(--text-color-quaternary)' }}
                        className="absolute left-0 top-0 h-full w-full"
                      />
                      <Icon
                        name="Check"
                        className="text-above-primary absolute-center absolute left-1/2 top-1/2"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ImagePreviewButton;
