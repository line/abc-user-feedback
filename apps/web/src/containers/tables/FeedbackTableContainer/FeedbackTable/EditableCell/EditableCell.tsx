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
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CircularProgress,
  Input,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { useToastDefaultOption } from '@/constants/toast-default-option';
import { useOAIMuataion } from '@/hooks';
import { FieldType } from '@/types/field.type';

import EditableSelectCell from './EditableSelectCell';

interface IProps extends React.PropsWithChildren {
  field: FieldType;
  value: any;
  channelId: string;
  feedbackId: string;
}

const EditableCell: React.FC<IProps> = (props) => {
  const { field, value, channelId, feedbackId } = props;

  const { t } = useTranslation();

  const [changedValue, setChangedValue] = useState(value);
  const [currentValue, setCurrentValue] = useState(value);

  const [isModifying, setIsModifying] = useState(false);

  const { mutateAsync, isLoading } = useOAIMuataion({
    method: 'put',
    path: '/api/channels/{channelId}/feedbacks/{feedbackId}/field/{fieldId}',
    pathParams: {
      channelId,
      feedbackId,
      fieldId: field.id,
    },
  });

  const onChangeValue = (v: any) => {
    setCurrentValue(v);
    setIsModifying(true);
  };

  const onClickCancel = () => {
    setIsModifying(false);
  };

  const onClickSave = async () => {
    try {
      await mutateAsync({ value: currentValue });
      setChangedValue(currentValue);
    } catch (error) {
      setCurrentValue(changedValue);
    }
    setIsModifying(false);
  };

  return (
    <>
      {isLoading && <CircularProgress isIndeterminate size={7} />}
      {field.type === 'text' ? (
        <Input
          type="text"
          value={currentValue}
          size="sm"
          onChange={(e) => onChangeValue(e.currentTarget.value)}
          isDisabled={field.isDisabled}
        />
      ) : field.type === 'number' ? (
        <Input
          type="number"
          value={currentValue}
          size="sm"
          onChange={(e) => onChangeValue(+e.currentTarget.value)}
          isDisabled={field.isDisabled}
        />
      ) : field.type === 'boolean' ? (
        <Checkbox
          isChecked={currentValue}
          size="sm"
          onChange={(e) => onChangeValue(e.currentTarget.checked)}
          isDisabled={field.isDisabled}
        />
      ) : field.type === 'select' ? (
        <EditableSelectCell
          currentValue={currentValue}
          field={field}
          onChangeValue={onChangeValue}
        />
      ) : (
        <>{currentValue}</>
      )}
      {isModifying && (
        <Box>
          <ButtonGroup pt={2}>
            <Button size="sm" onClick={onClickSave}>
              {t('button.save')}
            </Button>
            <Button size="sm" variant="outline" onClick={onClickCancel}>
              {t('button.cancel')}
            </Button>
          </ButtonGroup>
        </Box>
      )}
    </>
  );
};

export default EditableCell;
