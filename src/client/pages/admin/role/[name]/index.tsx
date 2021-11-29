/* */
import React, { useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import * as yup from 'yup'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Input } from 'baseui/input'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useQueryClient } from 'react-query'
import { H5 } from 'baseui/typography'
import { Checkbox } from 'baseui/checkbox'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, KIND, SIZE } from 'baseui/button'
import { Check } from 'baseui/icon'
import { useSnackbar } from 'baseui/snackbar'

/* */
import {
  getRoleByName,
  getRolePermissions,
  rolePermissionBinding,
  rolePermissionUnbinding
} from '~/service/role'
import { OWNER_KEY } from '@/constant'
import { AdminPageContainer } from '~/containers'
import { ErrorMessage, FormItem } from '~/components'
import { Permission } from '@/types'

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string()
})

const AdminRoleDetailPage = () => {
  const queryClient = useQueryClient()
  const { enqueue } = useSnackbar()
  const router = useRouter()

  const { t } = useTranslation()

  const roleName = router.query.name as string

  const { data: roleData } = useQuery(['role', roleName], () =>
    getRoleByName(roleName)
  )

  const { data: rolePermissionData } = useQuery(
    ['rolePermissions', roleName],
    () => getRolePermissions(roleName)
  )

  const { control, formState, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema)
  })

  const { errors } = formState

  useEffect(() => {
    if (roleData) {
      reset(roleData)
    }
  }, [roleData])

  const handleUpdateRole = async (payload) => {}

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
                disabled={roleName === OWNER_KEY}
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
        <Button type='submit' kind={KIND.secondary} size={SIZE.compact}>
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
