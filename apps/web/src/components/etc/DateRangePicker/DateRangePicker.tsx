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
import { enUS, ja, ko } from 'date-fns/locale';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import ReactDatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';

import { Icon, Popover, PopoverContent, PopoverTrigger, toast } from '@ufb/ui';

import type { DateRangeType } from '@/types/date-range.type';

dayjs.extend(weekday);

const DATE_FORMAT = 'YYYY-MM-DD';

interface IProps {
  onChange: (value: DateRangeType) => void;
  value: DateRangeType;
  minDate?: Date;
  maxDate?: Date;
  maxDays?: number;
  isClearable?: boolean;
  options?: {
    label: string;
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
        startDate: dayjs().subtract(7, 'day').startOf('day').toDate(),
        endDate: dayjs().endOf('day').toDate(),
      },
      {
        label: t('text.date.before-days', { day: 30 }),
        startDate: dayjs().subtract(30, 'day').startOf('day').toDate(),
        endDate: dayjs().endOf('day').toDate(),
      },
      {
        label: t('text.date.before-days', { day: 90 }),
        startDate: dayjs().subtract(90, 'day').startOf('day').toDate(),
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
    if (!currentValue?.startDate || !currentValue?.endDate) return;
    if (maxDays && isOverMaxDays(currentValue, maxDays)) {
      toast.negative({
        title: t('text.date.date-range-over-max-days', { maxDays }),
      });
      return;
    }
    onChange(currentValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={[
            'bg-fill-inverse hover:border-fill-primary inline-flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded border px-3.5 py-[9.5px]',
            currentValue ? 'text-primary' : 'text-tertiary',
            isOpen ? 'border-fill-primary' : 'border-fill-tertiary',
          ].join(' ')}
          onClick={() => setIsOpen(true)}
        >
          <p className="font-14-regular">
            {currentValue
              ? `${
                  currentValue?.startDate
                    ? dayjs(currentValue?.startDate).format(DATE_FORMAT)
                    : ''
                } ~ ${
                  currentValue?.endDate
                    ? dayjs(currentValue.endDate).format(DATE_FORMAT)
                    : ''
                }`
              : 'YYYY-MM-DD ~ YYYY-MM-DD'}
          </p>
          <div className="flex flex-row items-center gap-2">
            {isClearable && value && (
              <Icon
                name="CloseCircleFill"
                size={20}
                className="text-secondary opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
              />
            )}
            <Icon name="CalendarAStroke" size={20} className="text-tertiary" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent isPortal className="bg-tertiary">
        <div className="border-fill-secondary  flex border-b">
          <ul className="border-fill-secondary border-r p-2">
            {(options ?? items).map(({ label, startDate, endDate }, index) => (
              <li
                className={[
                  'font-14-regular hover:bg-fill-secondary m-1 w-[184px] rounded-sm px-2 py-2 hover:cursor-pointer',
                  activeIdx === index ? 'bg-fill-tertiary' : '',
                ].join(' ')}
                key={index}
                onClick={handleChangeDateRange(index, startDate, endDate)}
              >
                {label}
              </li>
            ))}
          </ul>
          <ReactDatePicker
            locale={
              i18n.language === 'ko' ? ko : i18n.language === 'ja' ? ja : enUS
            }
            onChange={(v) => {
              setCurrentValue({ startDate: v[0], endDate: v[1] });
              setActiveIdx(-1);
            }}
            startDate={currentValue?.startDate}
            endDate={currentValue?.endDate}
            monthsShown={2}
            minDate={minDate}
            maxDate={maxDate}
            disabledKeyboardNavigation
            selectsRange
            inline
            autoFocus
          />
        </div>
        <div className="float-right flex gap-2 p-2">
          <button className="btn btn-md btn-secondary" onClick={handleCancel}>
            {t('button.cancel')}
          </button>
          <button
            className="btn btn-md btn-primary"
            disabled={!currentValue?.startDate || !currentValue?.endDate}
            onClick={handleApply}
          >
            {t('button.save')}
          </button>
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
