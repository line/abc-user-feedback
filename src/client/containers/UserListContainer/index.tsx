/* */
import React, { useCallback } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useSnackbar } from 'baseui/snackbar'
import { Check, Delete } from 'baseui/icon'

/* */
import styles from './styles.module.scss'
import { UserLoader } from '~/components/Loader'
import { getUsers, userRoleBinding } from '~/service/user'
import SearchIcon from '~/assets/search.svg'
import MenuIcon from '~/assets/menu.svg'
import { IUser } from '@/types'
import { useUser } from '~/hooks'
import { Avatar, Input, DropDown, Tag } from '~/components'

const UserListContainer = () => {
  const queryClient = useQueryClient()
  const { enqueue } = useSnackbar()
  const { isLoading, isError, error, data } = useQuery<Array<IUser>>(
    'users',
    getUsers
  )

  const { user: currentUser } = useUser()

  const renderAvatar = useCallback((user: IUser) => {
    const isAvatarImageExist = !!user?.profile?.avatarUrl
    const avatarType = isAvatarImageExist ? 'image' : 'text'
    const src = isAvatarImageExist
      ? user?.profile?.avatarUrl
      : user?.profile?.nickname

    return <Avatar type={avatarType} src={src} />
  }, [])

  const handleRoleBinding = async (role: number, userId: string) => {
    try {
      await userRoleBinding(role, userId)
      queryClient.setQueryData('users', (users: Array<IUser>) =>
        users.map((user) => {
          if (user.id === userId) {
            user.role = role
            return user
          }

          return user
        })
      )
      enqueue({
        message: 'Success role binding',
        startEnhancer: ({ size }) => <Check size={size} />
      })
    } catch (error) {
      enqueue({
        message: error.toString(),
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  const renderUserTag = useCallback((user: IUser) => {
    if (user) {
      if (user.role === 1) {
        return (
          <Tag effect='dark' type='info' className={styles.tag}>
            Admin
          </Tag>
        )
      } else if (user.role === 2) {
        return (
          <Tag effect='dark' type='info' className={styles.tag}>
            Owner
          </Tag>
        )
      }
    }
  }, [])

  const isUserDropDownVisible = useCallback(
    (user: IUser) => {
      if (user && currentUser) {
        if (currentUser.id === user.id) {
          return false
        }

        return currentUser.role >= 1
      }

      return false
    },
    [currentUser]
  )

  if (isLoading) {
    return (
      <div className={styles.container}>
        <UserLoader rows={10} />
      </div>
    )
  }

  if (isError) {
    return <span>Error: {error}</span>
  }

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <Input prepand={<SearchIcon />} />
      </div>
      <div className={styles.list}>
        {data.map((user: IUser) => (
          <div key={user.id} className={styles.user}>
            <div className={styles.user__left}>{renderAvatar(user)}</div>
            <div className={styles.user__right}>
              <span className={styles.user__name}>
                {user.profile?.nickname}
              </span>
              <span className={styles.user__email}>({user.email})</span>
              <div className={styles.user__tags}>
                {user.id === currentUser?.id && (
                  <Tag type='primary' className={styles.tag}>
                    me
                  </Tag>
                )}
                {renderUserTag(user)}
              </div>
            </div>
            {isUserDropDownVisible(user) && (
              <DropDown className={styles.user__menu} overlay={<MenuIcon />}>
                <div className={styles.dropdown}>
                  {currentUser?.role >= 2 && user.role > 2 && (
                    <div
                      className={styles.dropdown__item}
                      onClick={() => handleRoleBinding(2, user.id)}
                    >
                      To Owner
                    </div>
                  )}
                  {currentUser?.role >= 1 && user.role > 1 && (
                    <div
                      className={styles.dropdown__item}
                      onClick={() => handleRoleBinding(1, user.id)}
                    >
                      To Admin
                    </div>
                  )}
                  {currentUser?.role >= 1 && user.role !== 0 && (
                    <div
                      className={styles.dropdown__item}
                      onClick={() => handleRoleBinding(0, user.id)}
                    >
                      To User
                    </div>
                  )}
                </div>
              </DropDown>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserListContainer
