import { useState } from 'react'

const useToggle = (init: boolean = false): [boolean, () => void] => {
  const [state, setState] = useState<boolean>(init)

  const toggleState = () => {
    setState((s) => !s)
  }

  return [state, toggleState]
}

export default useToggle
