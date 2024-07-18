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
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

import type { IconNameType } from '../Icon';
import { Icon } from '../Icon';
import { composeRefs } from '../utils';
import type { IInputProps } from './Input';
import { Input } from './Input';

export interface ITextInputProps extends Omit<IInputProps, 'leftChildren'> {
  isValid?: boolean;
  isSubmitted?: boolean;
  isSubmitting?: boolean;
  leftIconName?: IconNameType;
}

export const TextInput = forwardRef<HTMLInputElement, ITextInputProps>(
  (props, ref) => {
    const {
      isSubmitted,
      isSubmitting,
      isValid,
      leftIconName,
      className,
      onChange,
      rightChildren,
      ...rest
    } = props;

    const [iconType, setIconType] = useState<'clear' | 'success' | 'fail'>();

    const inputRef = useRef<HTMLInputElement>(null);

    const onClickClear = useCallback(() => {
      if (!inputRef.current) return;
      inputRef.current.value = '';
      setIconType(undefined);
    }, [inputRef]);

    useEffect(() => {
      if (isSubmitting ?? !isSubmitted) return;
      setIconType(isValid ? 'success' : 'fail');
    }, [isSubmitted, isValid, isSubmitting]);

    return (
      <Input
        leftChildren={
          leftIconName && (
            <Icon
              size={props.size === 'sm' ? 16 : 20}
              name={leftIconName}
              className="text-tertiary"
            />
          )
        }
        rightChildren={
          <>
            {!rest.disabled &&
              (iconType === 'clear' ?
                <button
                  type="button"
                  onClick={onClickClear}
                  disabled={rest.disabled}
                >
                  <Icon
                    size={props.size === 'sm' ? 16 : 20}
                    className="text-secondary"
                    name="CloseCircleFill"
                  />
                </button>
              : iconType === 'success' ?
                <Icon
                  size={props.size === 'sm' ? 16 : 20}
                  name="CircleCheck"
                  className="text-blue-primary"
                />
              : iconType === 'fail' ?
                <Icon
                  size={props.size === 'sm' ? 16 : 20}
                  name="WarningCircleFill"
                  className="text-red-primary"
                />
              : <></>)}
            {rightChildren}
          </>
        }
        className={`${leftIconName ? 'pl-10' : ''} pr-10 ${className ?? ''}`}
        onChange={(e) => {
          const { value } = e.currentTarget;
          if (value.length === 0) setIconType(undefined);
          else setIconType('clear');
          if (onChange) onChange(e);
        }}
        ref={composeRefs(inputRef, ref)}
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
        isValid={isValid}
        {...rest}
      />
    );
  },
);

TextInput.displayName = 'TextInput';
