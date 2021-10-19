/* */
import React, { useMemo, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import sortBy from 'lodash/sortBy'
import { ButtonGroup, SIZE as ButtonGroupSize } from 'baseui/button-group'
import { DatePicker } from 'baseui/datepicker'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Select } from 'baseui/select'
import { Input } from 'baseui/input'

/* */
import { FormFieldType, IFeedback } from '@/types'

interface Props {
  feedback: IFeedback
  onApply?: any
}

const ResponseFilter = (props: Props) => {
  const { feedback, onApply } = props
  const { control, register, setValue, watch, reset, getValues } = useForm()

  const handleApplyParams = () => {
    const values = getValues()
    const params = {}

    if (values.date?.length === 2) {
      params['start'] = values.date[0]
      params['end'] = values.date[1]
    }

    onApply(params)
  }

  const handleClearParams = () => {
    reset()
    onApply({})
  }

  const renderFilterItems = useMemo(() => {
    const items = [
      <FlexGridItem>
        <FormControl label='Date'>
          <Controller
            control={control}
            name='date'
            render={({ field: { onChange, ...rest } }) => (
              <DatePicker
                {...rest}
                onChange={({ date }) => {
                  setValue('date', Array.isArray(date) ? date : [date])
                }}
                placeholder='YYYY/MM/DD - YYYY/MM/DD'
                range
              />
            )}
          />
        </FormControl>
      </FlexGridItem>
    ]

    // if (feedback?.fields) {
    //   const sorted = sortBy(feedback?.fields ?? [], (o) => o?.order).map(
    //     (field) => field
    //   ) as any
    //
    //   sorted.map((field) => {
    //     if (field.type === FormFieldType.Select) {
    //       const option = [{ label: 'All', value: 'all' }].concat(
    //         field.option.map((o) => ({
    //           label: o,
    //           value: o
    //         }))
    //       )
    //
    //       items.push(
    //         <FlexGridItem>
    //           <FormControl label={field.name}>
    //             <Controller
    //               control={control}
    //               name={field.name}
    //               render={({ field: { onChange, ...rest } }) => (
    //                 <Select
    //                   {...rest}
    //                   options={option}
    //                   placeholder={field.name}
    //                   onChange={({ option }) => {
    //                     onChange(option?.value)
    //                   }}
    //                 />
    //               )}
    //             />
    //           </FormControl>
    //         </FlexGridItem>
    //       )
    //     } else if (field.type === FormFieldType.Text) {
    //       items.push(
    //         <FlexGridItem>
    //           <FormControl label={field.name}>
    //             <Input {...register(field.name)} placeholder={field.name} />
    //           </FormControl>
    //         </FlexGridItem>
    //       )
    //     }
    //   })
    // }

    return items
  }, [feedback])

  return (
    <div>
      <FlexGrid
        flexGridColumnCount={4}
        flexGridColumnGap='scale800'
        flexGridRowGap='scale800'
        marginBottom='scale800'
      >
        {renderFilterItems}
      </FlexGrid>
      <ButtonGroup size={ButtonGroupSize.compact}>
        <Button onClick={handleApplyParams}>Search</Button>
        <Button onClick={handleClearParams}>Clear</Button>
      </ButtonGroup>
    </div>
  )
}

export default ResponseFilter
