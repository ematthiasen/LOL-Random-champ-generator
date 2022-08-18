import { Snackbar, Alert, IconButton } from "@mui/material"
import { useEffect } from "react"
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbarContext } from "../contexts/snackbarContext"

const SnackbarDisplay = () => {

  const { snackbarMessage, setSnackbarMessage, snackbarOpen, updateSnackbarMessage, setSnackbarOpen } = useSnackbarContext()

  useEffect (() => {
    console.log('useEffect snackbar triggered')
    updateSnackbarMessage()
  }, [ snackbarMessage, snackbarOpen, updateSnackbarMessage] ) 

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false)
  }

  const handleSnackbarExited = () => {
    setSnackbarMessage(undefined)
  }

  return (
    <Snackbar
      key={snackbarMessage ? snackbarMessage.message : undefined}
      open={snackbarOpen}
      autoHideDuration={5000}
      onClose={handleSnackbarClose} 
      TransitionProps={{ onExited: handleSnackbarExited}}
    >
      <Alert severity={snackbarMessage ? snackbarMessage.type : undefined} action={<IconButton onClick={handleSnackbarClose}><CloseIcon /></IconButton>}>{snackbarMessage ? snackbarMessage.message : undefined}</Alert>
    </Snackbar>
  )

}

export default SnackbarDisplay