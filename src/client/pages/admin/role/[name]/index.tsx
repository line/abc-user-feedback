/* */
import React, { useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import * as yup from 'yup'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Input } from 'baseui/input'
import { useForm, Controller } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { H5 } from 'baseui/typography'
import { Checkbox } from 'baseui/checkbox'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, KIND as ButtonKind, SIZE as ButtonSize } from 'baseui/button'
import { Check, Delete } from 'baseui/icon'
import { useSnackbar } from 'baseui/snackbar'
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE as ModalSize
} from 'baseui/modal'

/* */
import {
  rolePermissionBinding,
  rolePermissionUnbinding,
  deleteRole,
  updateRole
} from '~/service/role'
import { GUEST_KEY, OWNER_KEY } from '@/constant'
import { AdminPageContainer } from '~/containers'
import { ErrorMessage, FormItem } from '~/components'
import { Permission } from '@/types'
import { useOAIQuery, useToggle } from '~/hooks'

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string()
})

const AdminRoleDetailPage = () => {
  const queryClient = useQueryClient()
  const { enqueue } = useSnackbar()
  const router = useRouter()

  const [showDeleteRoleModal, toggleShowDeleteRoleModal] = useToggle(false)

  const { t } = useTranslation()

  const roleName = router.query.name as string

  const { data: roleData } = useOAIQuery({
    queryKey: '/api/v1/admin/roles/{roleName}',
    variables: {
      roleName
    }
  })

  const { data: rolePermissionData }: any = useOAIQuery({
    queryKey:
      `/api/v1/admin/roles/binding/permission?roleName=${roleName}` as any
  })

  const { control, formState, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema)
  })

  const { errors } = formState

  useEffect(() => {
    if (roleData) {
      reset(roleData)
    }
  }, [roleData])

  const handleTogglePermission = async (e, permission: string) => {
    const checked = e.target.checked

    if (checked) {
      const rolePermission = await rolePermissionBinding({
        roleName,
        permission
      })

      queryClient.setQueryData(
        ['rolePermissions', roleName],
        (rolePermissions: Array<any>) => {
          return rolePermissions.concat(rolePermission.permission)
        }
      )

      enqueue({
        message: 'Success role binding',
        startEnhancer: ({ size }) => <Check size={size} />
      })
    } else {
      await rolePermissionUnbinding({
        roleName,
        permission
      })

      queryClient.setQueryData(
        ['rolePermissions', roleName],
        (rolePermissions: Array<any>) => {
          return rolePermissions.filter(
            (rolePermission) => rolePermission !== permission
          )
        }
      )

      enqueue({
        message: 'Success role unbinding',
        startEnhancer: ({ size }) => <Check size={size} />
      })
    }
  }

  const handleUpdateRole = async (payload) => {
    try {
      const { name } = await updateRole(roleName, payload)

      enqueue({
        message: 'Success update role',
        startEnhancer: ({ size }) => <Check size={size} />
      })

      await router.replace(`/admin/role/${name}`)
    } catch (error) {
      enqueue({
        message: error.response.data.message,
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  const handleDeleteRole = async () => {
    try {
      await deleteRole(roleName)

      enqueue({
        message: 'Success delete role',
        startEnhancer: ({ size }) => <Check size={size} />
      })

      await router.push('/admin/role')
    } catch (error) {
      enqueue({
        message: error.response.data.message,
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  return (
    <AdminPageContainer title='Role Detail'>
      <form onSubmit={handleSubmit(handleUpdateRole)}>
        <FormItem label='name' required>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <Input
                placeholder='name'
                {...field}
                disabled={roleName === OWNER_KEY || roleName === GUEST_KEY}
              />
            )}
          />
          <ErrorMessage errors={errors} name='name' />
        </FormItem>
        <FormItem label='description'>
          <Controller
            control={control}
            name='description'
            render={({ field }) => (
              <Input placeholder='description' {...field} />
            )}
          />
          <ErrorMessage errors={errors} name='description' />
        </FormItem>
        <Button
          type='submit'
          disabled={roleName === OWNER_KEY || roleName === GUEST_KEY}
          kind={ButtonKind.secondary}
          size={ButtonSize.compact}
        >
          Save
        </Button>
      </form>
      <H5
        overrides={{
          Block: {
            style: {
              marginTop: '60px'
            }
          }
        }}
      >
        Permissions
      </H5>
      {Object.entries(Permission).map(([key, name]) => (
        <Checkbox
          key={key}
          disabled={roleName === OWNER_KEY}
          checked={rolePermissionData?.includes(name)}
          onChange={(e) => handleTogglePermission(e, name)}
        >
          {name}
        </Checkbox>
      ))}
      <Button
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              marginTop: '140px',
              backgroundColor: $theme.colors.backgroundNegative,
              color: $theme.colors.buttonPrimaryText
            })
          }
        }}
        onClick={toggleShowDeleteRoleModal}
        kind={ButtonKind.secondary}
        disabled={roleName === OWNER_KEY || roleName === GUEST_KEY}
        size={ButtonSize.compact}
      >
        Delete this role
      </Button>
      <Modal
        isOpen={showDeleteRoleModal}
        onClose={toggleShowDeleteRoleModal}
        size={ModalSize.default}
        role={ROLE.dialog}
      >
        <ModalHeader>Delete Role</ModalHeader>
        <ModalBody>Delete {roleName}?</ModalBody>
        <ModalFooter>
          <ModalButton
            onClick={toggleShowDeleteRoleModal}
            kind={ButtonKind.tertiary}
          >
            {t('action.cancel')}
          </ModalButton>
          <ModalButton kind={ButtonKind.primary} onClick={handleDeleteRole}>
            {t('action.delete')}
          </ModalButton>
        </ModalFooter>
      </Modal>
    </AdminPageContainer>
  )
}

export const getServerSideProps = async ({ query }) => {
  const locale = query?.service?.locale || 'en'

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
}

export default AdminRoleDetailPage
