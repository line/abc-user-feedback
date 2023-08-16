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
import { ITextInputProps, Icon, TextInput } from '@ufb/ui';
import { useMemo, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

interface IProps extends ITextInputProps {}

const FeedbackSearch: React.FC<IProps> = (props) => {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);
  useClickAway(ref, () => setOpen(false));

  const filterIconCN = useMemo(
    () => (open ? 'text-primary' : 'text-tertiary'),
    [open],
  );

  return (
    <TextInput
      className="w-[360px]"
      placeholder="Text"
      leftIconName="Search"
      rightChildren={
        <div ref={ref}>
          <button onClick={() => setOpen((v) => !v)} className="p-0 icon-btn">
            <Icon
              name="FilterCircleFill"
              size={20}
              className={`${filterIconCN} hover:text-primary`}
            />
          </button>
          <div
            className={
              (open ? 'visivle' : 'hidden') +
              ' shadow border rounded w-[400px] absolute bg-primary right-0 p-5 '
            }
          >
            <div className="flex justify-between mb-4">
              <h1 className="font-16-bold">필터 검색</h1>
              <button className="icon-btn" onClick={() => setOpen((v) => !v)}>
                <Icon name="Close" size={16} />
              </button>
            </div>
            <div className="space-y-[10px] mb-4">
              <label className="block">
                <span className="block font-12-regular mb-[6px]">기간</span>
                <input className="input" placeholder="이슈 이름" />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                취소
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setOpen(false)}
              >
                편짐
              </button>
            </div>
          </div>
        </div>
      }
      {...props}
    />
  );
};

export default FeedbackSearch;
