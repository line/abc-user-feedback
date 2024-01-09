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

import { Icon, Popover, PopoverContent, PopoverTrigger } from '@ufb/ui';

interface IProps {
  urls: string[];
}

const ImageButton: React.FC<IProps> = () => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <button className="btn btn-secondary btn-xs btn-rounded gap-1">
          <Icon name="MediaImageFill" size={12} />
          Image
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="border-fill-secondary flex flex-col gap-5 border p-5"
        diabledDimmed
      >
        <h1 className="font-14-bold">미리보기</h1>
        <image />

        <div></div>
      </PopoverContent>
    </Popover>
  );
};

export default ImageButton;
