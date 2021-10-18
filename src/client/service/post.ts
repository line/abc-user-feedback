import client from './apiClient'

export const getPosts = () => client.get('/post').then((res) => res.data)

export const getPostById = (postId) =>
  client.get(`/post/${postId}`).then((res) => res.data)
