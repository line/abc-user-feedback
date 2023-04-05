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
import { CalendarIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  List,
  ListItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import { DateRangeType } from '@/types/date-rage.type';

dayjs.extend(weekday);

const DATE_FORMAT = 'YYYY. MM. DD';

const getDateRangeFormat = ({ endDate, startDate }: InputDateRangeType) =>
  `${startDate ? dayjs(startDate).format(DATE_FORMAT) : ''} ~ ${
    endDate ? dayjs(endDate).format(DATE_FORMAT) : ''
  }`;

type InputDateRangeType = {
  startDate: Date | string | null;
  endDate: Date | string | null;
};

interface IProps extends React.PropsWithChildren {
  onSubmit: (input: DateRangeType) => void;
  dateRange: DateRangeType;
}

const DateRangePicker: React.FC<IProps> = (props) => {
  const { dateRange, onSubmit } = props;
  const { t } = useTranslation();

  const [currentDateRange, setCurrentDateRange] =
    useState<InputDateRangeType>(dateRange);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(2);

  const items = useMemo(
    () => [
      {
        label: t('date.today'),
        startDate: dayjs().toDate(),
        endDate: dayjs().toDate(),
      },
      {
        label: t('date.yesterday'),
        startDate: dayjs().subtract(1, 'days').toDate(),
        endDate: dayjs().toDate(),
      },
      {
        label: t('date.thisWeek'),
        startDate: dayjs().weekday(0).toDate(),
        endDate: dayjs().toDate(),
      },
      {
        label: t('date.lastWeek'),
        startDate: dayjs().weekday(-7).toDate(),
        endDate: dayjs().weekday(-1).toDate(),
      },
      {
        label: t('date.thisMonth'),
        startDate: dayjs().startOf('M').toDate(),
        endDate: dayjs().toDate(),
      },
    ],
    [t],
  );

  useEffect(() => {
    setCurrentDateRange(dateRange);
  }, [dateRange]);

  const handleChangeDateRange =
    (index: number, startDate: Date, endDate: Date) => () => {
      setActiveIdx(index);
      setCurrentDateRange({ startDate, endDate });
    };
  const handleCancel = () => {
    setCurrentDateRange(dateRange);
    setIsOpen(false);
  };
  const handleApply = () => {
    const { endDate, startDate } = currentDateRange;
    if (!startDate || !endDate) return;
    onSubmit({ endDate, startDate });
    setIsOpen(false);
  };

  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <Button
          size="sm"
          variant="outline"
          colorScheme="gray"
          onClick={() => setIsOpen(true)}
        >
          <HStack spacing={3} divider={<StackDivider />}>
            <Text fontWeight="normal">
              {activeIdx === -1 ? t('custom') : items[activeIdx].label}
            </Text>
            <Text fontWeight="normal" display="inline-flex" alignItems="center">
              {getDateRangeFormat(dateRange)}
              <CalendarIcon ml={3} />
            </Text>
          </HStack>
        </Button>
      </PopoverTrigger>
      {isOpen && (
        <PopoverContent w="fit-content">
          <Flex alignItems="stretch">
            <List>
              {items.map(({ label, startDate, endDate }, index) => (
                <ListItem
                  key={index}
                  sx={listItemStyle(activeIdx === index)}
                  onClick={handleChangeDateRange(index, startDate, endDate)}
                >
                  {label}
                </ListItem>
              ))}
            </List>
            <Box borderLeftWidth={1}>
              <Text sx={{ textAlign: 'center', fontWeight: 500, p: 4 }}>
                {getDateRangeFormat(currentDateRange)}
              </Text>
              <Box
                className="light-theme"
                borderTopWidth={1}
                borderBottomWidth={1}
              >
                <ReactDatePicker
                  dateFormat="MM/dd/yyyy"
                  onChange={(v) => {
                    const [startDate, endDate] = v;
                    setCurrentDateRange({ startDate, endDate });
                    setActiveIdx(-1);
                  }}
                  startDate={
                    currentDateRange.startDate
                      ? new Date(currentDateRange.startDate)
                      : undefined
                  }
                  endDate={
                    currentDateRange.endDate
                      ? new Date(currentDateRange?.endDate)
                      : undefined
                  }
                  monthsShown={2}
                  maxDate={new Date()}
                  disabledKeyboardNavigation
                  selectsRange
                  inline
                  focusSelectedMonth={false}
                />
              </Box>
              <ButtonGroup float="right" p={2}>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  data-testid="cancelBtn"
                >
                  {t('button.cancel')}
                </Button>
                <Button
                  disabled={!currentDateRange.endDate}
                  onClick={handleApply}
                  data-testid="applyBtn"
                >
                  {t('button.apply')}
                </Button>
              </ButtonGroup>
            </Box>
          </Flex>
        </PopoverContent>
      )}
    </Popover>
  );
};

const listItemStyle = (isActive: boolean) => ({
  fontSize: 'sm',
  fontWeight: isActive ? 'bold' : 'normal',
  py: 4,
  px: 6,
  my: 2,
  _hover: { bg: 'secondary', cursor: 'pointer' },
  bg: isActive ? 'secondary' : 'transparent',
  color: isActive ? 'primary' : 'inherit',
});

export default DateRangePicker;
