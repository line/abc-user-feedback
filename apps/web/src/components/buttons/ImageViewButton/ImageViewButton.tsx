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

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { Icon, Popover, PopoverContent, PopoverTrigger } from '@ufb/ui';

interface IProps {
  urls: string[];
}

const ImageViewButton: React.FC<IProps> = ({ urls }) => {
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(urls[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(urls.length > 7);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.addEventListener('scroll', () => {
      if (!containerRef.current) return;
      const { scrollWidth, scrollLeft } = containerRef.current;

      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + 580 < scrollWidth);
    });
  }, [containerRef]);

  const scrollLeft = () => {
    if (!containerRef.current) return;
    const { scrollWidth, scrollLeft } = containerRef.current;

    const left = scrollLeft - 78;

    setShowLeftButton(left > 0);
    setShowRightButton(left + 580 <= scrollWidth);
    containerRef.current.scrollTo({ left, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!containerRef.current) return;
    const { scrollWidth, scrollLeft } = containerRef.current;

    const left = scrollLeft + 78;

    setShowLeftButton(left > 0);
    setShowRightButton(left + 580 <= scrollWidth);
    containerRef.current.scrollTo({
      left: containerRef.current.scrollLeft + 78,
      behavior: 'smooth',
    });
  };

  if (urls.length === 0) return null;
  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="btn btn-secondary btn-xs btn-rounded gap-1"
          onClick={() => setOpen(!open)}
        >
          <Icon name="MediaImageFill" size={12} />
          Image
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="border-fill-secondary flex flex-col gap-5 border p-5"
        diabledDimmed
      >
        <div className="flex items-center justify-between">
          <h1 className="font-14-bold">Image 미리보기</h1>
          <button
            className="icon-btn icon-btn-xs icon-btn-tertiary"
            onClick={() => setOpen(false)}
          >
            <Icon name="Close" />
          </button>
        </div>
        <div
          className="bg-fill-quaternary overflow-hidden rounded"
          style={{ width: 580, height: 400, position: 'relative' }}
        >
          {currentImage && (
            <Image src={currentImage} alt="preview" fill objectFit="contain" />
          )}
        </div>
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
                  <Image src={url} alt="preview" fill objectFit="cover" />
                  {url === currentImage && (
                    <>
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'var(--text-color-quaternary)',
                        }}
                        className="absolute left-0 top-0"
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

export default ImageViewButton;
