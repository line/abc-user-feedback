/* */
import React, { useEffect } from 'react'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import * as yup from 'yup'
import { nanoid } from 'nanoid'
import { Delete, Plus, DeleteAlt } from 'baseui/icon'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, KIND as ButtonKind } from 'baseui/button'
import { Block } from 'baseui/block'
import { Input } from 'baseui/input'
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
    unregister,
    setValue,
    formState,
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      type: null,
      options: [{ id: nanoid(), label: '', value: '' }],
      isRequired: false
    }
  })

  const {
    fields: selectFields,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'options'
  })

  const { errors, isDirty } = formState

  const watchType = watch('type')

  useEffect(() => {
    register('type')

    return () => {
      unregister('type')
    }
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
            <Controller
              control={control}
              name='name'
              render={({ field }) => <Input {...field} />}
            />
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
          <FormItem label='Select options'>
            {selectFields.map((field, index) => (
              <Block
                key={field.id}
                overrides={{
                  Block: {
                    style: {
                      display: 'flex',
                      alignItems: 'center'
                    }
                  }
                }}
              >
                <FormItem
                  label='label'
                  style={{ width: '100%', padding: '0 10px' }}
                >
                  <Controller
                    control={control}
                    name={`options.${index}.label`}
                    render={({ field: controlField }) => (
                      <Input
                        {...controlField}
                        disabled={watchType !== FormFieldType.Select}
                        key={field.id}
                        overrides={{
                          Root: {
                            style: {
                              width: '100%'
                            }
                          }
                        }}
                      />
                    )}
                  />
                  <ErrorMessage
                    errors={errors}
                    name={`options.${index}.label`}
                  />
                </FormItem>
                <FormItem
                  label='value'
                  style={{ width: '100%', padding: '0 20px 0 10px' }}
                >
                  <Controller
                    control={control}
                    name={`options.${index}.value`}
                    render={({ field: controlField }) => (
                      <Input
                        {...controlField}
                        disabled={watchType !== FormFieldType.Select}
                        key={field.id}
                        overrides={{
                          Root: {
                            style: {
                              width: '100%',
                              marginLeft: '8px'
                            }
                          }
                        }}
                      />
                    )}
                  />
                  <ErrorMessage
                    errors={errors}
                    name={`options.${index}.value`}
                  />
                </FormItem>
                <Button
                  kind={ButtonKind.minimal}
                  onClick={() => remove(index)}
                  disabled={watchType !== FormFieldType.Select}
                  overrides={{ Root: { style: { marginTop: '10px' } } }}
                >
                  <DeleteAlt size={16} />
                </Button>
              </Block>
            ))}
            <Button
              kind={ButtonKind.minimal}
              startEnhancer={() => <Plus />}
              disabled={watchType !== FormFieldType.Select}
              onClick={() => append({ id: nanoid(), label: '', value: '' })}
            >
              Add Option
            </Button>
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
