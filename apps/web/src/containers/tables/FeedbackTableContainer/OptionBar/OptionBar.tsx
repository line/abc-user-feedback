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
  Checkbox,
  Flex,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  MdFilterList,
  MdOutlineCompress,
  MdOutlineExpand,
} from 'react-icons/md';

import { DateRangePicker } from '@/components';
import { useOAIQuery } from '@/hooks';
import sessionStorage from '@/libs/session-storage';
import {
  useFeedbackTableStore,
  useSetFeedbackTableStore,
} from '@/stores/feedback-table.store';
import { toDateRangeStr } from '@/utils/date-range-str';

interface IProps {
  channelId: string;
}

const OptionBar: React.FC<IProps> = (props) => {
  const { channelId } = props;
  const { dateRange, isCellExpanded, columnVisibility, filterValues } =
    useFeedbackTableStore();

  const { updateDateRange, toggleCellExpanded, setColumnVisibility } =
    useSetFeedbackTableStore();

  const { t } = useTranslation();
  const { data: fieldData } = useOAIQuery({
    path: '/api/channels/{channelId}/fields',
    variables: { channelId },
  });
  const exportFeedbackResponse = (type: 'xlsx' | 'csv') => async () => {
    const response = await axios.post(
      `/api/channels/${channelId}/feedbacks/export`,
      {
        type,
        query: { ...toDateRangeStr(dateRange), ...filterValues },
      },
      {
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt')?.accessToken}`,
        },
      },
    );
    const filename = (response.headers as any)?.['content-disposition'].split(
      'filename=',
    )[1];
    const decodedFilename = decodeURI(filename.slice(1, filename.length - 1));

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', decodedFilename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Flex alignItems="center" gap={2}>
      <IconButton
        variant="outline"
        aria-label="expand and compress"
        size="sm"
        colorScheme="gray"
        onClick={toggleCellExpanded}
        icon={
          isCellExpanded ? (
            <MdOutlineCompress size={24} />
          ) : (
            <MdOutlineExpand size={24} />
          )
        }
      />
      <Popover>
        <PopoverTrigger>
          <IconButton
            variant="outline"
            aria-label="expand and compress"
            size="sm"
            colorScheme="gray"
            icon={<MdFilterList size={24} />}
          />
        </PopoverTrigger>
        <PopoverContent p={3}>
          {fieldData?.map((v) => (
            <Checkbox
              key={v.id}
              isChecked={columnVisibility[v.name] ?? true}
              onChange={(e) =>
                setColumnVisibility(v.name, e.currentTarget.checked)
              }
            >
              {v.name}
            </Checkbox>
          ))}
        </PopoverContent>
      </Popover>

      <DateRangePicker dateRange={dateRange} onSubmit={updateDateRange} />
      <Button
        size="sm"
        colorScheme="gray"
        onClick={exportFeedbackResponse('xlsx')}
      >
        {t('button.downloadXLSX')}
      </Button>
      <Button
        size="sm"
        colorScheme="gray"
        onClick={exportFeedbackResponse('csv')}
      >
        {t('button.downloadCSV')}
      </Button>
    </Flex>
  );
};

export default OptionBar;
