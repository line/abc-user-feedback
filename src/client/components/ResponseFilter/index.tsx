/* */
import React, { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { ButtonGroup } from 'baseui/button-group'
import { Button, KIND as ButtonKind, KIND, SIZE } from 'baseui/button'
import { Select } from 'baseui/select'
import { Input } from 'baseui/input'

/* */
import { FormFieldType, IFeedback } from '@/types'

interface Props {
  feedback: IFeedback
}

const ResponseFilter = (props: Props) => {
  const { feedback } = props
  const { control, register, clearErrors } = useForm()

  const [value, setValue] = useState<any>([])

  const renderFilterItems = useMemo(() => {
    const items = []

    if (feedback?.fields) {
      feedback.fields.map((field) => {
        if (field.type === FormFieldType.Select) {
          const option = field.option.map((o) => ({
            label: o,
            value: o
          }))

          items.push(
            <FlexGridItem>
              <Controller
                control={control}
                name={field.name}
                render={({ field: { onChange, ...rest } }) => (
                  <Select
                    {...rest}
                    options={option}
                    placeholder={field.name}
                    onChange={({ option }) => {
                      onChange(option?.value)
                    }}
                  />
                )}
              />
            </FlexGridItem>
          )
        } else if (field.type === FormFieldType.Text) {
          items.push(
            <FlexGridItem>
              <Input {...register(field.name)} placeholder={field.name} />
            </FlexGridItem>
          )
        }
      })
    }

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
      <ButtonGroup>
        <Button>Search</Button>
        <Button>Clear</Button>
      </ButtonGroup>
    </div>
  )
}

export default ResponseFilter
