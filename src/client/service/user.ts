import client from './apiClient'

export const updateUserSetting = (payload) =>
  client.put('/user/setting', payload).then((res) => res.data)

export const changePassword = (payload) =>
  client.post('/auth/password', payload).then((res) => res.data)

export const deleteSelfUser = () => client.delete('/user')

export const logout = () => client.post('/auth/logout')

/**
 * Admin
 */
export const userRoleBinding = (role, userId) => {
  return client
    .post(`/admin/user/role/${role}`, { userId })
    .then((res) => res.data)
}

export const getUsers = () => client.get('/admin/user').then((res) => res.data)

export const deleteUserById = (userId: string) =>
  client.delete(`/admin/user/${userId}`)
