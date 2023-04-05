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
  Button,
  ButtonGroup,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Switch,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { omit } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import ReactSelect from 'react-select';

import { DateRangePicker } from '@/components';
import { useOAIQuery } from '@/hooks';
import {
  useFeedbackTableStore,
  useSetFeedbackTableStore,
} from '@/stores/feedback-table.store';
import { FieldType } from '@/types/field.type';

interface IProps {
  channelId: string;
}

const toEqualId = (filter: FieldType) => (field: FieldType) =>
  field.id === filter.id;

const toSelectOption = (input: { id: string; name: string }) => ({
  value: input.id,
  label: input.name,
});
const toSelectOptionValue = (input?: { id?: string; name: string }) =>
  input
    ? {
        value: input?.id,
        label: input.name,
      }
    : null;

const FilterBar: React.FC<IProps> = (props) => {
  const { channelId } = props;
  const { filterValues } = useFeedbackTableStore();

  const { onFilterValuesChange } = useSetFeedbackTableStore();

  const { data } = useOAIQuery({
    path: '/api/channels/{channelId}/fields',
    variables: { channelId },
  });

  const { t } = useTranslation();

  const [currentFilters, setCurrentFilters] = useState<FieldType[]>([]);
  const [currentField, setCurrentField] = useState<FieldType | null>(null);
  const [currentValue, setCurrentValue] = useState<any>(null);

  useEffect(() => {
    const filters: FieldType[] = [];
    for (const key of Object.keys(filterValues)) {
      const field = data?.find((v) => v.name === key);
      if (!field) continue;
      filters.push(field);
    }

    setCurrentFilters(filters);
  }, [filterValues, data]);

  const onChangeCurrentValue = (value: any) => {
    setCurrentValue(value);
  };

  const addFilterValues = () => {
    if (!currentField || !currentValue) return;
    onFilterValuesChange({
      ...filterValues,
      [currentField.name]: currentValue,
    });
  };

  const getFilterValue = useCallback(
    (field: FieldType) => {
      const { type, name } = field;
      switch (type) {
        case 'select':
          return currentFilters
            .find(toEqualId(field))
            ?.options?.find((option) => option.name === filterValues[name])
            ?.name;
        case 'boolean':
        case 'text':
        case 'keyword':
        case 'number':
          return filterValues[name].toString();
        case 'date':
          const { gte, lt } = filterValues[name];
          return `${dayjs(gte).format('YYYY-MM-DD')}~${dayjs(lt).format(
            'YYYY-MM-DD',
          )}`;
        default:
          throw new Error('Unknown type');
      }
    },
    [currentFilters, filterValues],
  );

  const addFilter = (field: FieldType) => {
    setCurrentFilters((prev) => prev.concat([field]));
  };

  const removeFilter = (field: FieldType) => {
    setCurrentFilters((prev) =>
      prev.filter((filter) => filter.id !== field.id),
    );
    onFilterValuesChange(omit(filterValues, [field.name]));
  };

  const openFilter = (field: FieldType) => {
    setCurrentValue(filterValues[field.name]);
    setCurrentField(field);
  };

  const closeFilter = () => {
    setCurrentValue(null);
    setCurrentField(null);
  };

  return (
    <Flex gap={4} my={2}>
      <Menu>
        <MenuButton
          sx={{
            fontSize: 'sm',
            borderRadius: 'full',
            borderWidth: '1px',
            py: 1,
            px: 2,
          }}
        >
          {t('button.addFilter')}
        </MenuButton>
        <MenuList>
          {data
            ?.filter((field) => !currentFilters.find(toEqualId(field)))
            ?.filter(({ name }) => name !== 'createdAt' && name !== 'updatedAt')
            .map((filter) => (
              <MenuItem key={filter.id} onClick={() => addFilter(filter)}>
                {filter.name}
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
      {currentFilters
        .sort((a, b) => a.order - b.order)
        .map((currentFilter) => (
          <Popover key={currentFilter.id}>
            {({ onClose }) => (
              <>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    borderRadius="full"
                    size="sm"
                    bg={filterValues[currentFilter.name] ? 'gray.200' : 'white'}
                    onClick={() => openFilter(currentFilter)}
                  >
                    <Text>{currentFilter.name}</Text>
                    {filterValues[currentFilter.name] && (
                      <Text fontWeight="normal" ml={2}>
                        {getFilterValue(currentFilter)}
                      </Text>
                    )}
                    <Text as="sub" ml={2}>
                      {currentFilter.type}
                    </Text>
                  </Button>
                </PopoverTrigger>
                <PopoverContent p={2} gap={2} w="100%">
                  <PopoverBody>
                    {currentFilter.type === 'text' ||
                    currentFilter.type === 'keyword' ? (
                      <Input
                        type="text"
                        value={currentValue}
                        placeholder={`${currentFilter.name}을 입력해주세요.`}
                        onChange={(e) =>
                          onChangeCurrentValue(e.currentTarget.value)
                        }
                      />
                    ) : currentFilter.type === 'select' ? (
                      <ReactSelect
                        value={toSelectOptionValue(
                          currentField?.options?.find(
                            (v) => v.name === currentValue,
                          ),
                        )}
                        options={data
                          ?.find(toEqualId(currentFilter))
                          ?.options.map(toSelectOption)}
                        onChange={(option) =>
                          onChangeCurrentValue(option?.label)
                        }
                        isClearable
                      />
                    ) : currentFilter.type === 'number' ? (
                      <Input
                        type="number"
                        value={currentValue}
                        onChange={(e) =>
                          onChangeCurrentValue(e.currentTarget.value)
                        }
                      />
                    ) : currentFilter.type === 'boolean' ? (
                      <Switch
                        value={currentValue}
                        onChange={(e) =>
                          onChangeCurrentValue(e.currentTarget.checked)
                        }
                      />
                    ) : currentFilter.type === 'date' ? (
                      <DateRangePicker
                        dateRange={
                          currentValue
                            ? {
                                startDate: currentValue.gte,
                                endDate: currentValue.lt,
                              }
                            : {
                                startDate: new Date(),
                                endDate: new Date(),
                              }
                        }
                        onSubmit={(dateRange) => {
                          onChangeCurrentValue({
                            gte: dateRange.startDate,
                            lt: dateRange.endDate,
                          });
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </PopoverBody>
                  <PopoverFooter>
                    <ButtonGroup display="flex" justifyContent="flex-end">
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          removeFilter(currentFilter);
                          closeFilter();
                          onClose();
                        }}
                      >
                        {t('button.delete')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          closeFilter();
                          onClose();
                        }}
                      >
                        {t('button.cancel')}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          addFilterValues();
                          closeFilter();
                          onClose();
                        }}
                      >
                        {t('button.save')}
                      </Button>
                    </ButtonGroup>
                  </PopoverFooter>
                </PopoverContent>
              </>
            )}
          </Popover>
        ))}
    </Flex>
  );
};

export default FilterBar;
