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
import type { ReactNode } from 'react';
import { forwardRef, useMemo } from 'react';

export interface IInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
  isValid?: boolean;
  isSubmitted?: boolean;
  isSubmitting?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
  const {
    hint,
    label,
    isValid,
    isSubmitted,
    isSubmitting,
    leftChildren,
    rightChildren,
    className,
    size = 'md',
    ...rest
  } = props;

  const { inputCN, hintCN } = useMemo(() => {
    if (isSubmitting) return { inputCN: '', hintCN: '' };
    if (!isSubmitted) return { inputCN: '', hintCN: '' };
    if (typeof isValid === 'undefined') return { inputCN: '', hintCN: '' };
    if (isValid)
      return { inputCN: 'input-success', hintCN: 'input-hint-success' };
    else return { inputCN: 'input-error', hintCN: 'input-hint-error' };
  }, [isValid, isSubmitted, isSubmitting]);

  const sizeCN = useMemo(() => {
    switch (size) {
      case 'lg':
        return 'input-lg';
      case 'md':
        return 'input-md';
      case 'sm':
        return 'input-sm';
      default:
        return 'input-md';
    }
  }, [size]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={label} className="input-label">
          {label}{' '}
          {props.required && <span className="text-red-primary">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={label}
          ref={ref}
          {...rest}
          className={['input', inputCN, sizeCN, className].join(' ')}
          placeholder={rest.disabled ? '' : rest.placeholder}
        />
        {leftChildren && (
          <div className="absolute-y-center absolute left-[14px] flex items-center gap-2">
            {leftChildren}
          </div>
        )}
        {rightChildren && (
          <div className="absolute-y-center absolute right-[14px] flex items-center gap-2">
            {rightChildren}
          </div>
        )}
      </div>
      {hint && <span className={`input-hint ${hintCN}`}>{hint}</span>}
    </div>
  );
});

Input.displayName = 'Input';
