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
import { Draggable } from 'react-beautiful-dnd';

import { Icon } from '@ufb/ui';

interface IProps {
  name: string;
  index: number;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  isDisabled?: boolean;
}
const DraggableColumnItem: React.FC<IProps> = ({
  name,
  index,
  isChecked,
  onChange,
  isDisabled,
}: IProps) => {
  return (
    <Draggable
      draggableId={name}
      index={index}
      isDragDisabled={isDisabled}
      disableInteractiveElementBlocking={isDisabled}
    >
      {(provided) => (
        <label
          ref={provided.innerRef}
          className={[
            'flex items-center gap-2 py-1',
            isDisabled ? 'cursor-not-allowed' : '',
          ].join(' ')}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <input
            className="checkbox checkbox-sm"
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onChange(e.currentTarget.checked)}
            disabled={isDisabled}
          />
          <p className="font-12-regular flex-1">{name}</p>
          <Icon name="Handle" className="text-tertiary" size={20} />
        </label>
      )}
    </Draggable>
  );
};
export default DraggableColumnItem;
