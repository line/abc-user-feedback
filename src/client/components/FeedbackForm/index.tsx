/* */
import React, { useMemo, useState } from 'react'
import { useFormContext, useFieldArray, Controller } from 'react-hook-form'

/* */
import styles from './styles.module.scss'
import { FormFieldType } from '@/types'
import {
  FormItem,
  Input,
  Button,
  AddFormFieldModal,
  Table,
  ErrorMessage,
  Switch
} from '~/components'

interface Props {
  onSubmit?: any
  isEdit?: boolean
}

const typeText = {
  [FormFieldType.Text]: 'text',
  [FormFieldType.TextArea]: 'textarea',
  [FormFieldType.Select]: 'select',
  [FormFieldType.Boolean]: 'checkbox',
  [FormFieldType.Number]: 'number'
}

const FeedbackForm = (props: Props) => {
  const { isEdit = false } = props
  const { control, register, formState, clearErrors } = useFormContext()
  const { errors } = formState
  const [showAddFieldModal, setShowAddFieldModal] = useState<boolean>(false)

  const { fields, insert, remove, swap } = useFieldArray({
    control,
    name: 'fields'
  })

  const handleUpOrder = (idx: number) => {
    swap(idx, idx - 1)
  }

  const handleDownOrder = (idx: number) => {
    swap(idx, idx + 1)
  }

  const handleRemove = (idx: number) => {
    remove(idx)
    clearErrors(`fields`)
  }

  const tableColumns = useMemo(() => {
    const columns = [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }) => {
          return (
            <span style={{ textTransform: 'capitalize' }}>
              {typeText[value]}
            </span>
          )
        }
      },
      {
        Header: 'Required?',
        accessor: 'isRequired',
        Cell: ({ value }) => (value ? 'O' : 'X')
      }
    ] as any

    if (!isEdit) {
      columns.push(
        {
          Header: 'Order',
          accessor: 'orderUp',
          Cell: ({ row: { index } }) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  type='text'
                  onClick={() => handleUpOrder(index)}
                  disabled={index === 0}
                >
                  Up
                </Button>
              </div>
            )
          }
        },
        {
          Header: '',
          accessor: 'orderDown',
          Cell: ({ row: { index } }) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  type='text'
                  onClick={() => handleDownOrder(index)}
                  disabled={index === fields.length - 1}
                >
                  Down
                </Button>
              </div>
            )
          }
        },
        {
          Header: 'Menu',
          accessor: 'menu',
          Cell: ({ row: { index } }) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button type='text' onClick={() => handleRemove(index)}>
                  Remove
                </Button>
              </div>
            )
          }
        }
      )
    }
    return columns
  }, [fields, isEdit]) as any

  const handleShowAddFieldModal = () => {
    setShowAddFieldModal(true)
  }

  const handleCloseAddFieldModal = () => {
    setShowAddFieldModal(false)
  }

  const handleAddField = (field) => {
    insert(fields.length, field)
  }

  return (
    <div className={styles.form}>
      <FormItem label='Form Title' required>
        <Input {...register('title')} />
      </FormItem>
      <FormItem label='Code' required>
        <Input {...register('code')} />
        <ErrorMessage errors={errors} name='code' />
      </FormItem>
      <FormItem
        label='Allow anonymous'
        description='If you set it true, can response to this feedback without auth check'
      >
        <Controller
          control={control}
          name='allowAnonymous'
          render={({ field }) => <Switch {...field} disabled={isEdit} />}
        />
      </FormItem>
      <FormItem label='From fields' required className={styles.field}>
        <div className={styles.field__header}>
          <h3>{fields.length} Fields</h3>
          {!isEdit && (
            <Button
              onClick={handleShowAddFieldModal}
              className={styles.field__header__button}
            >
              Add field
            </Button>
          )}
        </div>
        <ErrorMessage errors={errors} name='fields' />
        <div className={styles.field__items}>
          <Table data={fields} columns={tableColumns} />
        </div>
      </FormItem>
      <AddFormFieldModal
        isOpen={showAddFieldModal}
        fields={fields}
        onClose={handleCloseAddFieldModal}
        onAdd={handleAddField}
      />
    </div>
  )
}

export default FeedbackForm
