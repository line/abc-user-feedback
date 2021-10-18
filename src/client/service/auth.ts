import client from '~/service/apiClient'

export const requestSignUp = (payload) =>
  client.post('/auth/register', payload).then((res) => res.data)

export const requestConfirm = (payload) =>
  client.post('/auth/confirm', payload).then((res) => res.data)

export const requestChangePassword = (payload) =>
  client.post('/auth/password/reset', payload).then((res) => res.data)

export const requestLogin = (payload) =>
  client.post('/auth/login', payload).then((res) => res.data)
