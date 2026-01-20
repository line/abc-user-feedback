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
import { useEffect, useMemo, useState } from 'react';
import type { Locale } from 'date-fns/locale';
import { de, enUS, ja, ko, zhCN } from 'date-fns/locale';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { useTranslation } from 'next-i18next';
import type { Matcher } from 'react-day-picker';

import {
  Badge,
  Button,
  Calendar,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ufb/react';

import type { DateRangeType } from '../types/date-range.type';
import { cn } from '../utils';
import { TextInput } from './inputs';

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
  allowEntirePeriod?: boolean;
  options?: {
    label: string | React.ReactNode;
    dateRange: DateRangeType;
  }[];
  children?: React.ReactNode;
  numberOfMonths?: number;
  tooltipContent?: string;
}

const DateRangePicker: React.FC<IProps> = (props) => {
  const {
    value,
    onChange,
    maxDate,
    minDate,
    maxDays,
    options,
    children,
    numberOfMonths = 2,
    allowEntirePeriod = true,
    tooltipContent,
  } = props;

  const { t, i18n } = useTranslation();

  const items = useMemo(() => {
    return [
      {
        label: t('text.date.today'),
        dateRange: {
          startDate: dayjs().startOf('day').toDate(),
          endDate: dayjs().endOf('day').toDate(),
        },
        days: 0,
      },
      {
        label: t('text.date.yesterday'),
        dateRange: {
          startDate: dayjs().subtract(1, 'day').startOf('day').toDate(),
          endDate: dayjs().subtract(1, 'day').endOf('day').toDate(),
        },
        days: 1,
      },
      {
        label: t('text.date.before-days', { day: 7 }),
        dateRange: {
          startDate: dayjs().subtract(6, 'day').startOf('day').toDate(),
          endDate: dayjs().endOf('day').toDate(),
        },
        days: 7,
      },
      {
        label: t('text.date.before-days', { day: 30 }),
        dateRange: {
          startDate: dayjs().subtract(29, 'day').startOf('day').toDate(),
          endDate: dayjs().endOf('day').toDate(),
        },
        days: 30,
      },
      {
        label: t('text.date.before-days', { day: 90 }),
        dateRange: {
          startDate: dayjs().subtract(89, 'day').startOf('day').toDate(),
          endDate: dayjs().endOf('day').toDate(),
        },
        days: 90,
      },
      {
        label: t('text.date.before-days', { day: 180 }),
        dateRange: {
          startDate: dayjs().subtract(179, 'day').startOf('day').toDate(),
          endDate: dayjs().endOf('day').toDate(),
        },
        days: 180,
      },
      {
        label: t('text.date.before-days', { day: 365 }),
        dateRange: {
          startDate: dayjs().subtract(364, 'day').toDate(),
          endDate: dayjs().endOf('day').toDate(),
        },
        days: 365,
      },
      {
        label: t('text.date.entire-period'),
        dateRange: null,
        days: -1,
      },
    ].filter(
      (v) =>
        maxDays === undefined ||
        maxDays === -1 ||
        (v.days !== -1 && v.days <= maxDays),
    );
  }, [t, maxDays]);

  const [currentValue, setCurrentValue] = useState<DateRangeType | null>(value);
  const [currentInput, setCurrentInput] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: '', endDate: '' });

  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    setActiveIdx(-1);
    setCurrentValue(value);
    if (value) {
      setActiveIdx(
        (options ?? items).findIndex(
          (item) =>
            item.dateRange &&
            item.dateRange.startDate?.toString() ===
              value.startDate?.toString() &&
            item.dateRange.endDate?.toString() === value.endDate?.toString(),
        ),
      );
      const { endDate, startDate } = value;
      setCurrentInput({
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',
      });
    }
  }, [value, isOpen]);

  useEffect(() => {
    setCurrentInput({
      startDate:
        currentValue?.startDate ?
          dayjs(currentValue.startDate).format('YYYY-MM-DD')
        : '',
      endDate:
        currentValue?.endDate ?
          dayjs(currentValue.endDate).format('YYYY-MM-DD')
        : '',
    });
  }, [currentValue]);

  const handleChangeDateRange =
    (index: number, dateRange: DateRangeType) => () => {
      setActiveIdx(index);
      setCurrentValue(dateRange);
    };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsOpen(false);
  };

  const handleApply = () => {
    if (maxDays && isOverMaxDays(currentValue, maxDays)) {
      toast.error(t('text.date.date-range-over-max-days', { maxDays }));
      return;
    }
    const shouldSetNull =
      currentValue !== null &&
      currentValue.startDate === null &&
      currentValue.endDate === null;
    onChange(shouldSetNull ? null : currentValue);
    setIsOpen(false);
  };

  const formatDate = (value: string) => {
    let cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length > 8) cleanedValue = cleanedValue.slice(0, 8);

    let formattedValue = '';
    if (cleanedValue.length > 4) {
      formattedValue += cleanedValue.slice(0, 4) + '-';
      if (cleanedValue.length > 6) {
        formattedValue += cleanedValue.slice(4, 6) + '-';
        formattedValue += cleanedValue.slice(6, 8);
      } else {
        formattedValue += cleanedValue.slice(4);
      }
    } else {
      formattedValue = cleanedValue;
    }

    return formattedValue;
  };

  const handleChange =
    (type: 'startDate' | 'endDate') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.value) {
        setCurrentValue((prev) => ({
          startDate: prev?.startDate ?? null,
          endDate: prev?.endDate ?? null,
          [type]: null,
        }));
        return;
      }
      const formattedDate = formatDate(event.target.value);
      setCurrentInput((prev) => ({ ...prev, [type]: formattedDate }));

      if (dayjs(formattedDate).format('YYYY-MM-DD') !== formattedDate) return;
      if (
        type === 'startDate' &&
        currentValue?.endDate &&
        dayjs(formattedDate).isAfter(currentValue.endDate)
      ) {
        setCurrentValue({
          startDate: currentValue.endDate,
          endDate: currentValue.endDate,
        });
        setCurrentInput((prev) => ({
          startDate: prev.endDate,
          endDate: prev.endDate,
        }));
        return;
      }
      if (
        type === 'endDate' &&
        currentValue?.startDate &&
        dayjs(formattedDate).isBefore(currentValue.startDate)
      ) {
        setCurrentValue({
          startDate: currentValue.startDate,
          endDate: currentValue.startDate,
        });
        setCurrentInput((prev) => ({
          startDate: prev.startDate,
          endDate: prev.startDate,
        }));
        return;
      }

      if (minDate && dayjs(formattedDate).isBefore(minDate)) {
        setCurrentValue((prev) => ({
          startDate: prev?.startDate ?? null,
          endDate: prev?.endDate ?? null,
          [type]: dayjs(minDate).toDate(),
        }));
        setCurrentInput((prev) => ({
          ...prev,
          [type]: dayjs(minDate).format('YYYY-MM-DD'),
        }));
        return;
      }

      if (maxDate && dayjs(formattedDate).isAfter(maxDate)) {
        setCurrentValue((prev) => ({
          startDate: prev?.startDate ?? null,
          endDate: prev?.endDate ?? null,
          [type]: dayjs(maxDate).toDate(),
        }));
        setCurrentInput((prev) => ({
          ...prev,
          [type]: dayjs(maxDate).format('YYYY-MM-DD'),
        }));
        return;
      }

      setCurrentValue((prev) => ({
        startDate: prev?.startDate ?? null,
        endDate: prev?.endDate ?? null,
        [type]: dayjs(formattedDate).toDate(),
      }));
    };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            {children ?
              <button className="w-full">{children}</button>
            : <Button variant="outline" className="gap-2">
                <Icon name="RiCalendar2Fill" />
                Date{' '}
                {value && (
                  <Badge variant="subtle">
                    {`${dayjs(value.startDate).format('YYYY-MM-DD')} ~ ${dayjs(value.endDate).format('YYYY-MM-DD')}`}
                  </Badge>
                )}
              </Button>
            }
          </PopoverTrigger>
        </TooltipTrigger>
        {tooltipContent && <TooltipContent>{tooltipContent}</TooltipContent>}
      </Tooltip>
      <PopoverContent className="p-2">
        <div className="flex">
          {numberOfMonths === 2 && (
            <ul className="pr-2">
              {(options ?? items).map(({ label, dateRange }, index) => (
                <li
                  className={cn([
                    'hover:bg-neutral-tertiary text-neutral-tertiary w-[184px] rounded-sm px-3 py-2 hover:cursor-pointer',
                    {
                      'bg-neutral-tertiary text-neutral-primary':
                        activeIdx === index,
                    },
                  ])}
                  key={index}
                  onClick={handleChangeDateRange(index, dateRange)}
                >
                  <p className="h-5">{label}</p>
                </li>
              ))}
            </ul>
          )}
          <div>
            {numberOfMonths === 2 && (
              <div className="flex gap-2">
                <TextInput
                  value={currentInput.startDate}
                  onChange={handleChange('startDate')}
                />
                <TextInput
                  value={currentInput.endDate}
                  onChange={handleChange('endDate')}
                />
              </div>
            )}
            <Calendar
              locale={locales[i18n.language]}
              className="border-none shadow-none"
              mode="range"
              onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                setCurrentValue({
                  startDate:
                    value?.from ?
                      dayjs(value.from).startOf('day').toDate()
                    : null,
                  endDate:
                    value?.to ? dayjs(value.to).endOf('day').toDate() : null,
                });
              }}
              selected={{
                from: currentValue?.startDate ?? undefined,
                to: currentValue?.endDate ?? undefined,
              }}
              numberOfMonths={numberOfMonths}
              disabled={{ before: minDate, after: maxDate } as Matcher}
            />
          </div>
        </div>
        <div className="float-right flex gap-2 [&>button]:min-w-20">
          <Button variant="outline" onClick={handleCancel}>
            {t('button.cancel')}
          </Button>
          <Button
            disabled={
              allowEntirePeriod ?
                currentValue ?
                  (!currentValue.startDate && !!currentValue.endDate) ||
                  (!currentValue.endDate && !!currentValue.startDate)
                : false
              : !currentValue?.startDate || !currentValue.endDate
            }
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
  if (maxDays < 0) return false;

  return maxDays <= dayjs(date.endDate).diff(date.startDate, 'days');
};

export default DateRangePicker;
