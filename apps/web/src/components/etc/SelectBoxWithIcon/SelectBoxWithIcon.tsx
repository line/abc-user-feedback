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
import { components } from 'react-select';

import type { ISelectBoxProps } from '../SelectBox/SelectBox';
import SelectBox from '../SelectBox/SelectBox';

interface IProps<Option, IsMulti extends boolean>
  extends ISelectBoxProps<Option, IsMulti> {
  SingleValue?: {
    left?: (data: Option) => React.ReactNode;
    right?: (data: Option) => React.ReactNode;
  };
  Option?: {
    left?: (data: Option) => React.ReactNode;
    right?: (data: Option) => React.ReactNode;
  };
}

function SelectBoxWithIcon<Option = unknown, IsMulti extends boolean = false>(
  props: IProps<Option, IsMulti>,
) {
  const { SingleValue, Option, ...otherProps } = props;
  return (
    <SelectBox
      isSearchable={false}
      components={{
        SingleValue: ({ children, ...otherProps }) => (
          <components.SingleValue {...otherProps}>
            <div className="flex items-center">
              {SingleValue?.left && SingleValue?.left(otherProps.data)}
              {children}
              {SingleValue?.right && SingleValue?.right(otherProps.data)}
            </div>
          </components.SingleValue>
        ),
        Option: ({ children, ...otherProps }) => {
          return (
            <components.Option {...otherProps}>
              <div className="flex items-center justify-between">
                {Option?.left && Option?.left(otherProps.data)}
                {children}
                {Option?.right && Option?.right(otherProps.data)}
              </div>
            </components.Option>
          );
        },
      }}
      {...otherProps}
    />
  );
}

export default SelectBoxWithIcon;
