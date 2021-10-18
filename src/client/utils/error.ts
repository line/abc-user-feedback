import { AxiosError } from 'axios'

export const parseValidateError = (error: AxiosError) => {
  const data = error.response?.data

  if (data?.message?.length) {
    const firstMessage = data?.message[0]
    const words = firstMessage.split(' ')
    const target = words.shift()
    const message = words.join(' ')

    return {
      target,
      message,
      original: firstMessage
    }
  }
}
