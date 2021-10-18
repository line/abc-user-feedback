import { QueryClient } from 'react-query'

export const createQueryClient = (defaultOptions?: any) =>
  new QueryClient({
    defaultOptions: {
      ...defaultOptions,
      queries: {
        retry: false,
        refetchInterval: false,
        refetchOnWindowFocus: false
      }
    }
  })
