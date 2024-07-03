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
import { useLayoutEffect, useRef, useState } from 'react';

import { Icon } from '@ufb/ui';

interface IProps extends React.PropsWithChildren {}

const CardSlider: React.FC<IProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [showRightButton, setShowRightButton] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width } = entry.contentRect;
      setShowRightButton(width < 1380);
    });
    observer.observe(containerRef.current);
    return () => {
      if (!containerRef.current) return;
      observer.unobserve(containerRef.current);
    };
  }, [containerRef.current]);

  const scrollLeft = () => {
    if (!containerRef.current) return;
    setShowLeftButton(false);
    setShowRightButton(true);
    containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (!containerRef.current) return;
    setShowLeftButton(true);
    setShowRightButton(false);
    containerRef.current.scrollTo({ left: 1380, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="scrollbar-hide overflow-auto" ref={containerRef}>
        <div className="flex min-w-[1380px] flex-wrap gap-3">{children}</div>
      </div>
      {showRightButton && (
        <button
          onClick={scrollRight}
          className="icon-btn icon-btn-secondary icon-btn-sm icon-btn-rounded absolute-y-center absolute right-0"
        >
          <Icon name="ArrowRight" />
        </button>
      )}
      {showLeftButton && (
        <button
          onClick={scrollLeft}
          className="icon-btn icon-btn-secondary icon-btn-sm icon-btn-rounded absolute-y-center absolute left-0"
        >
          <Icon name="ArrowLeft" />
        </button>
      )}
    </div>
  );
};

export default CardSlider;
