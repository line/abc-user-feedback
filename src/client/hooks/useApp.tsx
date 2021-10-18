/* */
import React, { useState, createContext, useContext } from 'react'

/* */
import { ClientConfig, IService } from '@/types'

interface AppContent {
  service?: IService
  config?: ClientConfig
  setService?: any
}

interface Props {
  service: IService
  config?: ClientConfig
  children?: React.ReactNode
}

export const AppContext = createContext<AppContent>({})

export function AppProvider(props: Props) {
  const [service, setService] = useState<IService>(props?.service)
  const [config] = useState<any>(props?.config ?? {})

  const value = {
    service,
    setService,
    config
  }

  return <AppContext.Provider value={value} {...props} />
}

const useApp = () => useContext(AppContext)

export default useApp
