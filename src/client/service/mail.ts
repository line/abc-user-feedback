import client from '~/service/apiClient'

export const sendFindPasswordEmail = (payload) =>
  client.post('/auth/mail/reset-password', payload).then((res) => res.data)

/**
 * Admin
 */
export const sendInvitationEmail = (payload) =>
  client.post('/admin/auth/mail/invitation', payload).then((res) => res.data)
