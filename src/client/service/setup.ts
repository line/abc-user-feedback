import client from './apiClient'

export const requestSetup = (payload) => client.post('/tenant', payload)
