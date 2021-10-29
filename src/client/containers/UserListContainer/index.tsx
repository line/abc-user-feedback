/* */
import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import { useQuery, useQueryClient } from 'react-query'
import { useSnackbar } from 'baseui/snackbar'
import { Check, Delete } from 'baseui/icon'
import { KIND as ButtonKind } from 'baseui/button'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ROLE,
  SIZE,
  ModalButton
} from 'baseui/modal'
import { useTranslation } from 'next-i18next'

/* */
import styles from './styles.module.scss'
import { UserLoader } from '~/components/Loader'
import { getUsers, userRoleBinding, deleteUserById } from '~/service/user'
import SearchIcon from '~/assets/search.svg'
import MenuIcon from '~/assets/menu.svg'
import { IUser } from '@/types'
import { useApp, useUser } from '~/hooks'
import { Avatar, Input, DropDown, Tag } from '~/components'

const UserListContainer = () => {
  const queryClient = useQueryClient()
  const { enqueue } = useSnackbar()
  const { isLoading, isError, error, data } = useQuery<Array<IUser>>(
    'users',
    getUsers
  )

  const { t } = useTranslation()

  const { config } = useApp()

  const [showDeleteUserModal, setShowDeleteUserModal] = useState<boolean>(false)
  const [deleteUser, setDeleteUser] = useState<IUser>(null)
  const { user: currentUser } = useUser()

  const renderAvatar = useCallback((user: IUser) => {
    return (
      <Avatar
        src={user?.profile?.avatarUrl}
        name={user?.profile?.nickname || user?.email}
      />
    )
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

  const handleCloseDeleteUserModal = () => {
    setShowDeleteUserModal(false)
    setDeleteUser(null)
  }

  const handleDeleteUser = async () => {
    if (deleteUser) {
      try {
        await deleteUserById(deleteUser.id)
        enqueue({
          message: 'Success delete user',
          startEnhancer: ({ size }) => <Check size={size} />
        })

        queryClient.setQueryData('users', (users: Array<IUser>) =>
          users.filter((user) => user.id !== deleteUser.id)
        )

        setShowDeleteUserModal(false)
        setDeleteUser(null)
      } catch (error) {
        enqueue({
          message: error.toString(),
          startEnhancer: ({ size }) => <Delete size={size} />
        })
      }
    }
  }

  const handleShowDeleteModal = (user: IUser) => {
    setDeleteUser(user)
    setShowDeleteUserModal(true)
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
            Manger
          </Tag>
        )
      } else if (user.role === 3) {
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

        if (user.role > currentUser.role) {
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
              {config.app.useNickname && (
                <span className={styles.user__name}>
                  {user.profile?.nickname}
                </span>
              )}
              <span className={styles.user__email}>
                {config.app.useNickname ? `(${user?.email})` : user.email}
              </span>
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
                  {currentUser?.role >= 3 && user.role !== 3 && (
                    <div
                      className={styles.dropdown__item}
                      onClick={() => handleRoleBinding(3, user.id)}
                    >
                      {t('action.member.to.owner')}
                    </div>
                  )}
                  {currentUser?.role >= 2 && user.role !== 2 && (
                    <div
                      className={styles.dropdown__item}
                      onClick={() => handleRoleBinding(2, user.id)}
                    >
                      {t('action.member.to.manager')}
                    </div>
                  )}
                  {currentUser?.role >= 2 && user.role !== 1 && (
                    <div
                      className={styles.dropdown__item}
                      onClick={() => handleRoleBinding(1, user.id)}
                    >
                      {t('action.member.to.admin')}
                    </div>
                  )}
                  {currentUser?.role === 2 && user.role !== 0 && (
                    <div
                      className={styles.dropdown__item}
                      onClick={() => handleRoleBinding(0, user.id)}
                    >
                      {t('action.member.to.guest')}
                    </div>
                  )}
                  {currentUser?.role >= 2 && (
                    <div
                      className={cx(
                        styles.dropdown__item,
                        styles.dropdown__item__warning
                      )}
                      onClick={() => handleShowDeleteModal(user)}
                    >
                      {t('action.member.delete')}
                    </div>
                  )}
                </div>
              </DropDown>
            )}
          </div>
        ))}
      </div>
      <Modal
        isOpen={showDeleteUserModal}
        onClose={handleCloseDeleteUserModal}
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <ModalHeader>{t('confirm.delete.member')}</ModalHeader>
        <ModalBody>{deleteUser?.email}</ModalBody>
        <ModalFooter>
          <ModalButton
            onClick={handleCloseDeleteUserModal}
            kind={ButtonKind.tertiary}
          >
            {t('action.cancel')}
          </ModalButton>
          <ModalButton kind={ButtonKind.primary} onClick={handleDeleteUser}>
            {t('action.delete')}
          </ModalButton>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default UserListContainer
