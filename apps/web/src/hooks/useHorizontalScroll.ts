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

const useHorizontalScroll = (input: {
  defaultRightButtonShown: boolean;
  scrollGap: number;
}) => {
  const { defaultRightButtonShown, scrollGap } = input;
  const containerRef = useRef<HTMLDivElement>(null);

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(
    defaultRightButtonShown,
  );

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

    const left = scrollLeft - scrollGap;

    setShowLeftButton(left > 0);
    setShowRightButton(left + 580 <= scrollWidth);
    containerRef.current.scrollTo({ left, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!containerRef.current) return;
    const { scrollWidth, scrollLeft } = containerRef.current;

    const left = scrollLeft + scrollGap;

    setShowLeftButton(left > 0);
    setShowRightButton(left + 580 <= scrollWidth);
    containerRef.current.scrollTo({ left, behavior: 'smooth' });
  };

  return {
    containerRef,
    scrollLeft,
    scrollRight,
    showLeftButton,
    showRightButton,
  };
};
export default useHorizontalScroll;
