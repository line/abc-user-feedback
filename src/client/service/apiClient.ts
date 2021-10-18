import axios from 'axios'

// const host =
//   process.env.NODE_ENV === 'production'
//     ? '/api/v1'
//     : 'http://localhost:3001/api/v1'

const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true
})

export default apiClient
