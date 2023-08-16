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
import { HTMLProps, useEffect, useRef } from 'react';

interface IProps extends HTMLProps<HTMLInputElement> {
  indeterminate?: boolean;
}

const TableCheckbox: React.FC<IProps> = ({ indeterminate, ...rest }) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        ref={ref}
        className="checkbox checkbox-sm"
        onClick={(e) => e.stopPropagation()}
        {...rest}
      />
    </div>
  );
};

export default TableCheckbox;
