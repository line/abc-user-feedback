import client from './apiClient'

/**
 * Admin
 */
export const getRoleByName = (roleName: string) => {
  return client.get(`/admin/roles/${roleName}`).then((res) => res.data)
}

export const createRole = (payload) => {
  return client.post(`/admin/roles`, payload).then((res) => res.data)
}

export const updateRole = (roleName, payload) => {
  return client.put(`/admin/roles/${roleName}`, payload).then((res) => res.data)
}

export const rolePermissionBinding = (payload) => {
  return client
    .post(`/admin/roles/binding/permission`, payload)
    .then((res) => res.data)
}

export const rolePermissionUnbinding = (payload) => {
  return client
    .delete(`/admin/roles/binding/permission`, {
      data: payload
    })
    .then((res) => res.data)
}

export const getRolePermissions = (roleName: string) => {
  return client
    .get(`/admin/roles/binding/permission?roleName=${roleName}`)
    .then((res) => res.data)
}

export const roleBindingPermission = () => {}

export const deleteRole = (roleName: string) => {
  return client.delete(`/admin/roles/${roleName}`).then((res) => res.data)
}
