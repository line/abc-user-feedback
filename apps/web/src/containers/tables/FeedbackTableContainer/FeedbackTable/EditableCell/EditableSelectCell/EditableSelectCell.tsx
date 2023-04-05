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
import { useToast } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { MultiValue, SingleValue } from 'react-select';
import ReactSelect from 'react-select/creatable';

import { useToastDefaultOption } from '@/constants/toast-default-option';
import { useOAIMuataion, useOAIQuery } from '@/hooks';
import { FieldType } from '@/types/field.type';

export const toSelectOption = (input: { name: string; id: string }) => ({
  label: input.name,
  value: input.id,
});

interface IProps extends React.PropsWithChildren {
  currentValue: any;
  onChangeValue: (v: any) => void;
  field: FieldType;
}

const EditableSelectCell: React.FC<IProps> = (props) => {
  const { currentValue, field, onChangeValue } = props;
  const queryClient = useQueryClient();
  const toast = useToast(useToastDefaultOption);

  const { data: options } = useOAIQuery({
    path: '/api/field/{fieldId}/options',
    variables: { fieldId: field.id },
  });

  const { mutateAsync: createOption, status: createOptionStatus } =
    useOAIMuataion({
      method: 'post',
      path: '/api/field/{fieldId}/options',
      pathParams: { fieldId: field.id },
    });

  const handleCreateOption = useCallback(
    async (name: string) => {
      const res = await createOption({ name });
      if (!res) return;
      await queryClient.invalidateQueries(['/api/field/{fieldId}/options']);
      handleChangeValue({ value: res.id, label: name });
    },
    [currentValue],
  );

  const currentOption = useMemo(() => {
    switch (field.type) {
      case 'select':
        const option = options?.find((v) => v.name === currentValue);
        if (!option) return null;
        return toSelectOption(option);
      default:
        throw new Error('type error');
    }
  }, [options, currentValue]);

  useEffect(() => {
    if (createOptionStatus === 'success') {
      toast({
        title: 'successfully create option',
        status: createOptionStatus,
      });
    }
  }, [createOptionStatus]);

  const handleChangeValue = (
    v:
      | MultiValue<{ label: string; value: string }>
      | SingleValue<{ label: string; value: string }>,
  ) => {
    onChangeValue((v as { label: string } | undefined)?.label);
  };

  return (
    <ReactSelect
      isClearable
      instanceId="selectOption"
      value={currentOption}
      options={options?.map(toSelectOption)}
      onChange={handleChangeValue}
      onCreateOption={handleCreateOption}
      isLoading={createOptionStatus === 'loading'}
      menuPosition="fixed"
      isDisabled={field.isDisabled}
      styles={{
        valueContainer: (base) => ({
          ...base,
          maxHeight: '100px',
          overflowX: 'auto',
        }),
      }}
    />
  );
};

export default EditableSelectCell;
