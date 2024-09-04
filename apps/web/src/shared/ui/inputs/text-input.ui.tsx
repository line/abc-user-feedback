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
import React from 'react';

import type { IconNameType, TextInputProps } from '@ufb/react';
import {
  TextInput as Input,
  InputBox,
  InputCaption,
  InputField,
  InputIcon,
  InputLabel,
} from '@ufb/react';

interface Props extends Omit<TextInputProps, 'error' | 'required'> {
  required?: boolean;
  label: string;
  error?: string;
  leftIcon?: IconNameType;
  right?: React.ReactNode;
}

const TextInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { required, label, error, leftIcon, right, ...textInputProps } = props;

  return (
    <InputField>
      <InputLabel>
        {label} {required && <span className="text-tint-red">*</span>}
      </InputLabel>
      <div className="input-container flex gap-2">
        <InputBox className="flex-1">
          {leftIcon && <InputIcon name={leftIcon} />}
          <Input
            {...textInputProps}
            className="flex-1"
            error={!!error}
            required={required}
            ref={ref}
          />
        </InputBox>
        {right}
      </div>
      {error && <InputCaption variant="error">{error}</InputCaption>}
    </InputField>
  );
});
TextInput.displayName = 'TextInput';

export default TextInput;
