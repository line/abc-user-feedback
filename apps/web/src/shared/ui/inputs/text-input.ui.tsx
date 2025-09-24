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
import React, { useState } from 'react';

import type { TextInputProps } from '@ufb/react';
import {
  Caption,
  TextInput as Input,
  InputBox,
  InputEyeButton,
  InputField,
  Label,
} from '@ufb/react';

interface Props extends Omit<TextInputProps, 'error' | 'required' | 'value'> {
  required?: boolean;
  label?: string;
  error?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  rightButton?: React.ReactNode;
  infoCaption?: string;
  successCaption?: string;
  value?: string | readonly string[] | number | null;
}

const TextInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    required,
    label,
    error,
    left,
    right,
    rightButton,
    size,
    type,
    infoCaption,
    successCaption,
    ...textInputProps
  } = props;
  const [inputType, setInputType] = useState(type);

  return (
    <InputField className="w-full">
      {label && (
        <Label>
          {label} {required && <span className="text-tint-red">*</span>}
        </Label>
      )}
      <div className="input-container flex gap-2">
        <InputBox className="w-full flex-1">
          {left && (
            <div className="absolute-y-center absolute left-2">{left}</div>
          )}
          <Input
            ref={ref}
            {...textInputProps}
            value={textInputProps.value ?? undefined}
            className="flex-1"
            size={size}
            type={inputType}
          />
          {type === 'password' && (
            <InputEyeButton
              onChangeVisibility={(visible) =>
                setInputType(visible ? 'text' : 'password')
              }
            />
          )}
          {right && (
            <span className="absolute-y-center absolute right-2">{right}</span>
          )}
        </InputBox>
        {rightButton}
      </div>
      {!!error && <Caption variant="error">{error}</Caption>}
      {!!infoCaption && <Caption variant="info">{infoCaption}</Caption>}
      {!!successCaption && (
        <Caption variant="success">{successCaption}</Caption>
      )}
    </InputField>
  );
});
TextInput.displayName = 'TextInput';

export default TextInput;
