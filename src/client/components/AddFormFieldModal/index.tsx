/* */
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Delete } from 'baseui/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { KIND as ButtonKind } from 'baseui/button'
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ModalProps,
  ROLE,
  SIZE as ModalSize
} from 'baseui/modal'

/* */
import styles from './styles.module.scss'
import { FormFieldType } from '@/types'
import {
  Input,
  Textarea,
  Checkbox,
  FormItem,
  ErrorMessage,
  Button as SelectButton
} from '~/components'
import { useSnackbar } from 'baseui/snackbar'

interface Props extends ModalProps {
  onClose?: any
  onAdd?: any
  fields?: Array<any>
}

const items = [
  {
    type: FormFieldType.Text,
    name: 'Text',
    description: 'short text'
  },
  {
    type: FormFieldType.Number,
    name: 'Number',
    description: 'allow only number'
  },
  {
    type: FormFieldType.Boolean,
    name: 'boolean',
    description: 'true or false'
  },
  {
    type: FormFieldType.Select,
    name: 'Select',
    description: 'select one'
  }
]

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[a-zA-Z0-9]*$/, 'field name allow only number, letter')
    .required(),
  type: yup.mixed().required('select Type'),
  option: yup.string(),
  isRequired: yup.boolean()
})

const AddFormFieldModal = (props: Props) => {
  const { onClose, onAdd, fields = [], isOpen } = props
  const { enqueue } = useSnackbar()

  const {
    register,
    trigger,
    control,
    getValues,
    setValue,
    formState,
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      type: null,
      option: '',
      isRequired: false
    }
  })

  const { errors, isDirty } = formState
  const watchType = watch('type')

  useEffect(() => {
    register('type')
  }, [])

  const handleCloseModal = () => {
    reset()
    onClose?.()
  }

  const handleSelectType = (type: FormFieldType) => {
    setValue('type', type)
  }

  const handleClickCancel = () => {
    reset()
    onClose?.()
  }

  const handleAddField = async () => {
    const valid = await trigger()

    if (valid) {
      const values = getValues()
      const isSameFieldNameExist = fields.find(
        (_field: any) => _field.name === values.name
      )

      if (!isSameFieldNameExist) {
        onAdd(getValues())
        handleClickCancel()
      } else {
        enqueue({
          message: `Same field name ${values.name} exists`,
          startEnhancer: ({ size }) => <Delete size={size} />
        })
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size={ModalSize.auto}
      role={ROLE.dialog}
    >
      <ModalHeader>Add Field</ModalHeader>
      <ModalBody>
        <div className={styles.form}>
          <FormItem label='Form name' required>
            <Input {...register('name')} />
            <ErrorMessage errors={errors} name='name' />
          </FormItem>
          <FormItem label='Select field type' required>
            <div className={styles.form__type}>
              {items.map((item) => (
                <div className={styles.elem} key={item.type}>
                  <SelectButton
                    className={styles.elem__button}
                    type={watchType === item.type ? 'primary' : 'default'}
                    onClick={() => handleSelectType(item.type)}
                  >
                    <div className={styles.elem__type}>{item.name}</div>
                    <div className={styles.elem__description}>
                      {item.description}
                    </div>
                  </SelectButton>
                </div>
              ))}
            </div>
            <ErrorMessage errors={errors} name='type' />
          </FormItem>
          <FormItem label='Select value list (one line per value)'>
            <Controller
              control={control}
              name='option'
              render={({ field }) => (
                <Textarea
                  {...field}
                  disabled={watchType !== FormFieldType.Select}
                  rows={watchType === FormFieldType.Select ? 7 : 1}
                />
              )}
            />
            <ErrorMessage errors={errors} name='option' />
          </FormItem>
          <h3>Constraint</h3>
          <div className={styles.constraint}>
            <div className={styles.constraint__elem}>
              <Controller
                control={control}
                name='isRequired'
                render={({ field }) => (
                  <Checkbox {...field}>Required field</Checkbox>
                )}
              />
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <ModalButton onClick={handleClickCancel} kind={ButtonKind.tertiary}>
          Cancel
        </ModalButton>
        <ModalButton
          kind={ButtonKind.primary}
          onClick={handleAddField}
          disabled={!isDirty}
        >
          Add
        </ModalButton>
      </ModalFooter>
    </Modal>
  )
}

export default AddFormFieldModal
