import { createContext, useContext, useState,  useMemo } from 'react'

const SnackbarContext = createContext()

const useSnackbarContext = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbarContext must be used inside a SnackbarContextProvider')
  }

  const { snackbarList,
          setSnackbarList,
          snackbarMessage,
          setSnackbarMessage,
          snackbarOpen,
          setSnackbarOpen
        } = context

  const updateSnackbarMessage = () => {
    if (snackbarList.length && !snackbarMessage) {
      setSnackbarMessage({...snackbarList[0]})
      setSnackbarList((prev) => prev.slice(1))
      setSnackbarOpen(true)
      console.log('set snackbar Message', {...snackbarList[0]})
    } else if (snackbarList.length && snackbarMessage && snackbarOpen) {
      setSnackbarOpen(false)
    }
  }

  const displaySnackbarMessage = (message, type ) => {
    setSnackbarList((prev) => [...prev, { message, type }])
  }

  return { ...context, updateSnackbarMessage, displaySnackbarMessage}
}

const SnackbarContextProvider = (props) => {
  const [ snackbarList, setSnackbarList ] = useState([])
  const [ snackbarOpen, setSnackbarOpen ] = useState(false)
  const [ snackbarMessage, setSnackbarMessage ] = useState(undefined)

  const value = useMemo(() => {
    return { 
      snackbarList,
      setSnackbarList,
      snackbarOpen,
      setSnackbarOpen,
      snackbarMessage,
      setSnackbarMessage
     }}, [snackbarList, snackbarOpen, snackbarMessage ])
  return <SnackbarContext.Provider value={value} {...props} />

}

export { SnackbarContextProvider, useSnackbarContext }