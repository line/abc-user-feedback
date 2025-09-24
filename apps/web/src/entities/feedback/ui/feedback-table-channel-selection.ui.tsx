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

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

import { Button, Icon, Tabs, TabsList, TabsTrigger } from '@ufb/react';

interface Props {
  channels: { id: number; name: string }[];
  currentChannelId: number;
  setCurrentChannelId: (id: number) => void;
  totalItems?: number;
}

const FeedbackTableChannelSelection = (props: Props) => {
  const { channels, currentChannelId, setCurrentChannelId, totalItems } = props;
  const { t } = useTranslation();
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);

  const checkScrollState = () => {
    const container = tabsContainerRef.current;
    if (container) {
      const isScrollable = container.scrollWidth > container.clientWidth;
      setShowScrollButtons(isScrollable);

      if (isScrollable) {
        setShowLeftGradient(container.scrollLeft > 0);
        setShowRightGradient(
          0.5 + container.scrollLeft + container.clientWidth <
            container.scrollWidth,
        );
      } else {
        setShowLeftGradient(false);
        setShowRightGradient(false);
      }
    }
  };

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      checkScrollState();
    });

    resizeObserver.observe(container);

    checkScrollState();
    container.addEventListener('scroll', checkScrollState);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', checkScrollState);
    };
  }, [channels, tabsContainerRef]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = tabsContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div className="relative flex items-center overflow-auto">
      <div className="scrollbar-hide relative flex-1 overflow-auto">
        {showLeftGradient && (
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-gradient-to-r from-[var(--bg-neutral-primary)] to-transparent" />
        )}

        <Tabs
          value={String(currentChannelId)}
          onValueChange={(v) => setCurrentChannelId(Number(v))}
          className="scrollbar-hide overflow-auto"
          ref={tabsContainerRef}
        >
          <TabsList className="scrollbar-hide">
            {channels.length === 0 ?
              <TabsTrigger value="-1">
                {t('v2.text.no-data.channel')}
              </TabsTrigger>
            : channels.map((channel) => (
                <TabsTrigger key={channel.id} value={String(channel.id)}>
                  {channel.name}
                  {currentChannelId === channel.id && (
                    <span className="ml-1 font-bold">{totalItems}</span>
                  )}
                </TabsTrigger>
              ))
            }
          </TabsList>
        </Tabs>

        {showRightGradient && (
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-gradient-to-l from-[var(--bg-neutral-primary)] to-transparent" />
        )}
      </div>

      {showScrollButtons && (
        <div className="ml-2 flex items-center gap-2">
          <Button
            variant="outline"
            radius="large"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            disabled={!showLeftGradient}
          >
            <Icon name="RiArrowLeftLine" />
          </Button>
          <Button
            variant="outline"
            radius="large"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            disabled={!showRightGradient}
          >
            <Icon name="RiArrowRightLine" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeedbackTableChannelSelection;
