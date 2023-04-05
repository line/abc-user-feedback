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
import { FormLabel } from '@chakra-ui/react';
import { Control as ControlProps, Controller } from 'react-hook-form';
import ReactSelect, { components } from 'react-select';

// import Control from 'react-select/dist/declarations/src/components/Control';

interface IProps {
  name: string;
  control: ControlProps<any, any>;
  options?: { label: string; value: string | number }[];
  label?: string;
}

const FormSelect: React.FC<IProps> = ({ control, name, options, label }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ReactSelect
          instanceId={name}
          {...field}
          options={options}
          placeholder=" "
          components={{
            SelectContainer: (props) => (
              <components.SelectContainer {...props}>
                <FormLabel>{label}</FormLabel>
                {props.children}
              </components.SelectContainer>
            ),
          }}
        />
      )}
    />
  );
};

export default FormSelect;
