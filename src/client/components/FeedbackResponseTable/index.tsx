import React, { useMemo } from 'react'
import {
  SIZE as TableSize,
  TableBuilder,
  TableBuilderColumn
} from 'baseui/table-semantic'
import { Checkbox } from 'baseui/checkbox'
import { DateTime } from 'luxon'
import { ArrowDown, ArrowUp } from 'baseui/icon'

/* */
import { FormFieldType, Permission } from '@/types'
import { withComma } from '@/server/utils/string'
import { useUser } from '~/hooks'

export type DateOrder = 'asc' | 'desc'

interface Props<T> {
  data: Array<T>
  order?: DateOrder
  colums: Array<string>
  loading?: boolean
  selected?: Array<number>
  onSortToggle: () => any
  onRowClick?: (e: any) => any
  onSelect?: (ids: Array<number>) => any
  onToggleCheckBox?: (e: any) => any
}

function FeedbackResponseTable<T>(props: Props<T>) {
  const {
    data = [],
    colums,
    loading = false,
    order = 'desc',
    onRowClick = () => {},
    onSelect = () => {},
    onSortToggle = () => {},
    selected = []
  } = props

  const { hasPermission } = useUser()

  const handleSelectCheckbox = (e: any) => {
    e.stopPropagation()

    const { checked, name } = e.currentTarget
    let ids = selected.flat()
    if (checked && !selected.includes(+name)) {
      ids = ids.concat(+name)
    } else {
      ids = ids.filter((id) => +id !== +name)
    }

    onSelect(ids)
  }

  const renderDateHeader = useMemo(() => {
    return (
      <div
        onClick={onSortToggle}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <span>Date</span>
        {order === 'desc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
      </div>
    )
  }, [order])

  return (
    <TableBuilder<T>
      data={data}
      isLoading={loading}
      size={TableSize.compact}
      emptyMessage={<h1>No data</h1>}
      overrides={{
        TableBodyRow: {
          props: {
            onClick: onRowClick
          }
        }
      }}
    >
      {hasPermission(Permission.DELETE_RESPONSE) && (
        <TableBuilderColumn
          overrides={{
            TableHeadCell: { style: { width: '1%' } },
            TableBodyCell: { style: { width: '1%' } }
          }}
        >
          {(row) => (
            <Checkbox
              name={row.id}
              checked={selected.includes(row.id)}
              onChange={handleSelectCheckbox}
            />
          )}
        </TableBuilderColumn>
      )}
      <TableBuilderColumn
        header='No.'
        numeric
        overrides={{
          TableHeadCell: { style: { width: '20px' } },
          TableBodyCell: { style: { width: '20px' } }
        }}
      >
        {(row) => withComma(row.id)}
      </TableBuilderColumn>
      <TableBuilderColumn
        header={renderDateHeader}
        overrides={{
          TableHeadCell: {
            style: { width: '200px', textTransform: 'capitalize' }
          },
          TableBodyCell: { style: { width: '200px' } }
        }}
      >
        {(row) =>
          DateTime.fromISO(row.createdTime, { zone: 'utc' }).toFormat(
            'yyyy-MM-dd HH:mm'
          )
        }
      </TableBuilderColumn>
      {colums.map((col) => (
        <TableBuilderColumn
          header={col}
          key={col}
          overrides={{
            TableHeadCell: {
              style: { textTransform: 'capitalize' }
            },
            TableBodyCell: {
              style: {
                overflow: 'hidden',
                maxWidth: '200px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }
            }
          }}
        >
          {(row) => {
            const content = row.feedbackResponseFields.find((field) => {
              return field.feedbackField.name === col
            })

            const value =
              content.feedbackField.type === FormFieldType.Select
                ? content.feedbackField.options.find(
                    (option) => option.value === content.value
                  )?.label
                : content.value

            return <span title={value}>{value}</span>
          }}
        </TableBuilderColumn>
      ))}
    </TableBuilder>
  )
}

export default FeedbackResponseTable
