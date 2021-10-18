import client from './apiClient'

export const getService = () =>
  client.get('/admin/service').then((res) => res.data)

export const updateService = (payload) =>
  client.put('/admin/service', payload).then((res) => res.data)

export const updateInvitation = (payload) =>
  client
    .put('/admin/service/invitation', {
      isRestrictDomain: payload?.isRestrictDomain,
      allowDomains: payload?.allowDomains.split('\n')
    })
    .then((res) => res.data)
