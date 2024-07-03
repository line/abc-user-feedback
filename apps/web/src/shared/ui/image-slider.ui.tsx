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

import Image from 'next/image';

import { Icon } from '@ufb/ui';

import { useHorizontalScroll } from '@/shared';

interface IProps {
  urls: string[];
}

const ImageSlider: React.FC<IProps> = ({ urls }) => {
  const {
    containerRef,
    scrollLeft,
    scrollRight,
    showLeftButton,
    showRightButton,
  } = useHorizontalScroll({
    defaultRightButtonShown: urls.length > 4,
    scrollGap: 140,
  });

  return (
    <div className="relative w-full overflow-hidden">
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
        ref={containerRef}
        style={{ width: 580 }}
      >
        <div className="flex gap-2">
          {urls?.map((url) => (
            <div
              key={url}
              className="relative shrink-0 cursor-pointer overflow-hidden rounded"
              style={{ width: 140, height: 80 }}
              onClick={() => window.open(url, '_blank')}
            >
              <div
                style={{ background: 'var(--text-color-quaternary)' }}
                className="absolute left-0 top-0 z-10 h-full w-full"
              />
              <Icon
                name="Search"
                className="text-above-primary absolute-center absolute left-1/2 top-1/2 z-20 text-white"
              />
              <Image
                src={url}
                alt="preview"
                className="h-full w-full object-cover"
                fill
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ImageSlider;
