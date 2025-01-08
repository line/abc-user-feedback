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
import { useEffect, useMemo, useState } from 'react';
import type { Locale } from 'date-fns/locale';
import { de, enUS, ja, ko, zhCN } from 'date-fns/locale';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import type { Matcher } from 'react-day-picker';
import { useTranslation } from 'react-i18next';

import {
  Badge,
  Button,
  Calendar,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from '@ufb/react';

import type { DateRangeType } from '../types/date-range.type';
import { cn } from '../utils';

const locales: Record<string, Locale> = {
  ko,
  en: enUS,
  ja,
  zh: zhCN,
  de,
};
dayjs.extend(weekday);

interface IProps {
  onChange: (value: DateRangeType) => void;
  value: DateRangeType;
  minDate?: Date;
  maxDate?: Date;
  maxDays?: number;
  isClearable?: boolean;
  options?: {
    label: string | React.ReactNode;
    startDate: Date;
    endDate: Date;
  }[];
}

const DateRangePicker: React.FC<IProps> = (props) => {
  const { value, onChange, maxDate, minDate, maxDays, isClearable, options } =
    props;

  const { t, i18n } = useTranslation();

  const items = useMemo(() => {
    return [
      {
        label: t('text.date.today'),
        startDate: dayjs().startOf('day').toDate(),
        endDate: dayjs().endOf('day').toDate(),
      },
      {
        label: t('text.date.yesterday'),
        startDate: dayjs().subtract(1, 'day').startOf('day').toDate(),
        endDate: dayjs().subtract(1, 'day').endOf('day').toDate(),
      },
      {
        label: t('text.date.before-days', { day: 7 }),
        startDate: dayjs().subtract(6, 'day').startOf('day').toDate(),
        endDate: dayjs().endOf('day').toDate(),
      },
      {
        label: t('text.date.before-days', { day: 30 }),
        startDate: dayjs().subtract(29, 'day').startOf('day').toDate(),
        endDate: dayjs().endOf('day').toDate(),
      },
      {
        label: t('text.date.before-days', { day: 90 }),
        startDate: dayjs().subtract(89, 'day').startOf('day').toDate(),
        endDate: dayjs().endOf('day').toDate(),
      },
    ];
  }, [t]);

  const [currentValue, setCurrentValue] = useState<DateRangeType | null>(value);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    setActiveIdx(-1);
    setCurrentValue(value);
  }, [value, isOpen]);

  const handleChangeDateRange =
    (index: number, startDate: Date, endDate: Date) => () => {
      setActiveIdx(index);
      setCurrentValue({ startDate, endDate });
    };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsOpen(false);
  };

  const handleApply = () => {
    if (!currentValue?.startDate || !currentValue.endDate) return;
    if (maxDays && isOverMaxDays(currentValue, maxDays)) {
      toast.error(t('text.date.date-range-over-max-days', { maxDays }));
      return;
    }
    onChange(currentValue);
    setIsOpen(false);
  };
  console.log('value: ', value);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon name="RiCalendar2Fill" />
          Date{' '}
          {value && (
            <Badge variant="subtle">
              {`${dayjs(value.startDate).format('YYYY-MM-DD')} ~ ${dayjs(value.endDate).format('YYYY-MM-DD')}`}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <div className="flex">
          <ul>
            {(options ?? items).map(({ label, startDate, endDate }, index) => (
              <li
                className={cn([
                  'font-14-regular hover:bg-fill-secondary my-1 w-[184px] rounded-sm px-2 py-2 hover:cursor-pointer',
                  { 'bg-fill-tertiary': activeIdx === index },
                ])}
                key={index}
                onClick={handleChangeDateRange(index, startDate, endDate)}
              >
                {label}
              </li>
            ))}
          </ul>
          <Calendar
            locale={locales[i18n.language]}
            className="border-none shadow-none"
            mode="range"
            onSelect={(value: { from?: Date; to?: Date } | undefined) => {
              setCurrentValue({
                startDate: value?.from ?? null,
                endDate: value?.to ?? null,
              });
            }}
            selected={{
              from: currentValue?.startDate ?? undefined,
              to: currentValue?.endDate ?? undefined,
            }}
            numberOfMonths={2}
            defaultMonth={
              new Date(new Date().setMonth(new Date().getMonth() - 1))
            }
            disabled={{ before: minDate, after: maxDate } as Matcher}
          />
        </div>
        <div className="float-right flex gap-2 [&>button]:min-w-20">
          <Button variant="outline" onClick={handleCancel}>
            {t('button.cancel')}
          </Button>
          <Button
            disabled={!currentValue?.startDate || !currentValue.endDate}
            onClick={handleApply}
          >
            {t('button.save')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const isOverMaxDays = (date: DateRangeType, maxDays: number) => {
  if (!date) return false;
  if (!date.startDate || !date.endDate) return false;

  return maxDays < dayjs(date.endDate).diff(date.startDate, 'days');
};

export default DateRangePicker;
