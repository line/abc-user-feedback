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
import { useStore } from 'zustand';

import useThemeStore from '@/zustand/theme.store';

interface IProps extends React.TableHTMLAttributes<HTMLTableRowElement> {
  isSelected: boolean;
  hoverElement?: React.ReactNode;
}

const TableRow: React.FC<IProps> = (props) => {
  const { isSelected, children, hoverElement, ...otherProps } = props;
  const ref = useRef<HTMLTableRowElement>(null);
  const theme = useStore(useThemeStore, ({ theme }) => theme);

  const [isHover, setIsHover] = useState(false);
  const [rowHeight, setRowHeight] = useState(50);

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (!ref.current) return;
      setRowHeight(ref.current?.scrollHeight);
    });
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <tr
        ref={ref}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
        className={[
          'hover:bg-fill-quaternary',
          isSelected ? 'bg-fill-quaternary' : '',
          otherProps.onClick ? 'cursor-pointer' : '',
        ].join(' ')}
        {...otherProps}
      >
        {children}
      </tr>
      {hoverElement && (
        <tr
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className={[isHover ? 'visible' : 'hidden'].join(' ')}
        >
          <td
            className="left-30 absolute flex -translate-y-[102%] items-center gap-3 p-3"
            style={{
              background:
                theme === 'light' ?
                  'linear-gradient(90deg, #F4F4F5 0%, #F4F4F5 83%, rgba(244, 244, 245, 0) 100%)'
                : 'linear-gradient(90deg, #151517 0%, #151517 83%, rgba(21, 21, 23, 0) 100%)',
              height: rowHeight - 1,
              border: 'none',
            }}
          >
            {hoverElement}
          </td>
        </tr>
      )}
    </>
  );
};

export default TableRow;
