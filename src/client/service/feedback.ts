import client from './apiClient'

export const createFeedback = (payload) =>
  client.post('/admin/feedback', payload).then((res) => res.data)

export const updateFeedback = (code: string, payload) =>
  client.patch(`/admin/feedback/${code}`, payload).then((res) => res.data)

export const deleteFeedback = (code: string) =>
  client.delete(`/admin/feedback/${code}`).then((res) => res.data)

export const deleteResponse = (code: string, id: number) => {
  client
    .delete(`/admin/feedback/${code}/response/${id}`)
    .then((res) => res.data)
}

export const getFeedbackreponses = (code, params) => {
  return client
    .get(`/admin/feedback/${code}/response`, {
      params
    })
    .then((res) => res.data)
}

export const exportFeedbackResponse = (
  code: string,
  exportType: string,
  params: Record<string, unknown>
) => {
  return client
    .get(`/admin/feedback/${code}/response-export`, {
      params: {
        type: exportType,
        ...params
      },
      responseType: 'arraybuffer'
    })
    .then((response) => {
      const filename = decodeURI(
        response.headers?.['content-disposition'].split('filename=')[1]
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(`/admin/feedback/${code}/response/export`)
    })
}
