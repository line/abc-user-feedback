/* */
import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { Button, KIND as ButtonKind } from 'baseui/button'
import { useForm } from 'react-hook-form'
import { Input } from 'baseui/input'
import { useSnackbar } from 'baseui/snackbar'
import { useRouter } from 'next/router'
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE
} from 'baseui/modal'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { useTranslation } from 'next-i18next'
import { Check, Delete } from 'baseui/icon'

/* */
import styles from './styles.module.scss'
import { UserLoader as RoleLoader } from '~/components/Loader'
import { createRole, getRoles } from '~/service/role'
import { IRole, Permission } from '@/types'
import { useToggle, useUser } from '~/hooks'
import { ErrorMessage, FormItem } from '~/components'

const RoleListContainer = () => {
  const queryClient = useQueryClient()
  const { enqueue } = useSnackbar()
  const { isLoading, isError, error, data } = useQuery<Array<IRole>>(
    'roles',
    getRoles
  )

  const router = useRouter()

  const { t } = useTranslation()
  const { register, formState, handleSubmit } = useForm()
  const { errors } = formState

  const [showCreateRoleModal, toggleShowCreateRoleModal] = useToggle(false)

  const { user, hasPermission } = useUser()

  const handleCreateRole = async (payload) => {
    try {
      const role = await createRole(payload)
      enqueue({
        message: 'Success create role',
        startEnhancer: ({ size }) => <Check size={size} />
      })

      queryClient.setQueryData('roles', (roles: Array<IRole>) =>
        roles.concat(role)
      )

      toggleShowCreateRoleModal()
    } catch {
      enqueue({
        message: 'error when create role',
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <RoleLoader rows={10} />
      </div>
    )
  }

  if (isError) {
    return <span>Error: {error}</span>
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <div className={styles.title}>
          <div>{data?.length} roles</div>
          {hasPermission(Permission.MANAGE_ROLE) && (
            <Button
              onClick={toggleShowCreateRoleModal}
              overrides={{
                BaseButton: {
                  style: {
                    marginLeft: 'auto'
                  }
                }
              }}
            >
              Create new role
            </Button>
          )}
        </div>
        <TableBuilder
          data={data}
          overrides={{
            TableBodyRow: {
              style: {
                cursor: 'pointer'
              },
              props: {
                onClick: async (e) => {
                  const role = data?.[e.target.closest('tr').rowIndex - 1]
                  if (role) {
                    await router.push(`/admin/role/${role.name}`)
                  }
                }
              }
            }
          }}
        >
          <TableBuilderColumn
            header='Name'
            overrides={{
              TableBodyCell: {
                style: {
                  textTransform: 'capitalize'
                }
              }
            }}
          >
            {(row) => row.name}
          </TableBuilderColumn>
          <TableBuilderColumn header='Description'>
            {(row) => row.description}
          </TableBuilderColumn>
          <TableBuilderColumn header='Binding users'>
            {(row) => row.bindingCount}
          </TableBuilderColumn>
        </TableBuilder>
      </div>
      <Modal
        isOpen={showCreateRoleModal}
        onClose={toggleShowCreateRoleModal}
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <form onSubmit={handleSubmit(handleCreateRole)}>
          <ModalHeader>Create Role</ModalHeader>
          <ModalBody>
            <FormItem label='name' required>
              <Input placeholder='name' {...register('name')} />
              <ErrorMessage errors={errors} name='name' />
            </FormItem>
            <FormItem label='description'>
              <Input placeholder='description' {...register('description')} />
              <ErrorMessage errors={errors} name='description' />
            </FormItem>
          </ModalBody>
          <ModalFooter>
            <ModalButton
              onClick={toggleShowCreateRoleModal}
              kind={ButtonKind.tertiary}
            >
              {t('action.cancel')}
            </ModalButton>
            <ModalButton type='submit'> {t('action.save')}</ModalButton>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  )
}

export default RoleListContainer
