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
import React from 'react';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  InputBox,
  InputField,
  TextInput,
} from '@ufb/react';

import type { CommonFormItemType } from '@/shared/types';

interface Props
  extends CommonFormItemType<string | number>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
  type?: 'text' | 'number';
}

const FormInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, type = 'text', required, value, ...props }, ref) => (
    <FormItem>
      <InputField>
        {label && (
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
        )}
        <InputBox>
          <FormControl>
            <TextInput
              type={type}
              value={value === null ? '' : value}
              {...props}
              ref={ref}
            />
          </FormControl>
        </InputBox>
        <FormMessage />
      </InputField>
    </FormItem>
  ),
);

export default FormInput;
