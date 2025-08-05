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

import { InputField, Label } from '@ufb/react';

import { Slider } from '../slider.ui';

interface Props {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  label?: string;
  step?: number;
}

const SliderInput = (props: Props) => {
  const { value, onValueChange, min = 0, max = 100, label, step } = props;

  return (
    <InputField>
      <Label>{label}</Label>
      <div>
        <Slider
          value={value}
          min={min}
          max={max}
          step={step}
          onValueChange={onValueChange}
        />
      </div>
    </InputField>
  );
};

export default SliderInput;
