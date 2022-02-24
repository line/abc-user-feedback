/* */
import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { Block } from 'baseui/block'
import { ButtonGroup, SIZE as ButtonGroupSize } from 'baseui/button-group'
import { CheckIndeterminate } from 'baseui/icon'
import { DatePicker } from 'baseui/datepicker'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { useTranslation } from 'next-i18next'
import { DateTime } from 'luxon'

interface Props {
  onApply?: any
}

const ResponseFilter = (props: Props) => {
  const { onApply } = props

  const { control, watch, reset, getValues, setValue } = useForm({
    defaultValues: {
      startDate: null,
      endDate: null
    }
  })

  const watchStartDate = watch('startDate')
  const watchEndDate = watch('endDate')

  const { t } = useTranslation()

  useEffect(() => {
    const start = DateTime.fromJSDate(watchStartDate)
    const end = DateTime.fromJSDate(watchEndDate)

    if (start.isValid && end.isValid) {
      const { days } = start.diff(end, 'days')

      if (days > 0) {
        setValue('endDate', null)
      }
    }
  }, [watchStartDate, watchEndDate])

  const handleApplyParams = () => {
    const values = getValues()
    const params = {}

    if (values.startDate && values.endDate) {
      params['start'] = DateTime.fromJSDate(values.startDate)
        .startOf('day')
        .toISO()
      params['end'] = DateTime.fromJSDate(values.endDate).endOf('day').toISO()
    }

    onApply(params)
  }

  const handleClearParams = () => {
    reset()
    onApply({})
  }

  const isSearchEnable = useMemo(() => {
    return watchStartDate && watchEndDate
  }, [watchStartDate, watchEndDate])

  const renderFilterItems = useMemo(() => {
    const items = [
      <FlexGridItem key='date'>
        <FormControl label='Date'>
          <Block
            overrides={{
              Block: {
                style: { display: 'flex', alignItems: 'center' }
              }
            }}
          >
            <Controller
              control={control}
              name='startDate'
              render={({ field: { onChange, ...rest } }) => (
                <DatePicker
                  {...rest}
                  overrides={{
                    InputWrapper: {
                      style: {
                        minWidth: '150px'
                      }
                    }
                  }}
                  onChange={({ date }) => {
                    setValue('startDate', date)
                  }}
                  placeholder='YYYY/MM/DD'
                  clearable
                />
              )}
            />
            <CheckIndeterminate
              size={48}
              overrides={{
                Svg: {
                  style: {
                    margin: '0 5px'
                  }
                }
              }}
            />
            <Controller
              control={control}
              name='endDate'
              render={({ field: { onChange, ...rest } }) => (
                <DatePicker
                  {...rest}
                  overrides={{
                    InputWrapper: {
                      style: {
                        minWidth: '150px'
                      }
                    }
                  }}
                  onChange={({ date }) => {
                    setValue('endDate', date)
                  }}
                  placeholder='YYYY/MM/DD'
                  clearable
                />
              )}
            />
          </Block>
        </FormControl>
      </FlexGridItem>
    ]

    return items
  }, [])

  return (
    <div>
      <FlexGrid
        flexGridColumnCount={2}
        flexGridColumnGap='scale800'
        flexGridRowGap='scale800'
        marginBottom='scale800'
      >
        {renderFilterItems}
      </FlexGrid>
      <ButtonGroup size={ButtonGroupSize.compact}>
        <Button onClick={handleApplyParams} disabled={!isSearchEnable}>
          {t('action.search')}
        </Button>
        <Button onClick={handleClearParams}>{t('action.clear')}</Button>
      </ButtonGroup>
    </div>
  )
}

export default ResponseFilter
