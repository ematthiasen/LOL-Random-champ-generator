import {  Typography, Container, IconButton, AppBar, Toolbar, Grid } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import React, { useMemo, useState } from 'react'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import Lobby from './components/Lobby'
import { SummonerContextProvider } from './contexts/summonerContext'
import { TeamlistContextProvider } from './contexts/teamlistContext'
import MasterySettings from './components/MasterySettings'
import { SnackbarContextProvider } from './contexts/snackbarContext'
import SnackbarDisplay from './components/SnackbarDisplay'



function App() {
  const [ paletteMode, setPaletteMode ] = useState('dark')

  const customTheme = useMemo(() => createTheme({
    
    palette: {
      mode: paletteMode,
      type: 'light',
      primary: {
        main: '#303f9f',
      },
      secondary: {
        main: '#9fa8da',
        contrastText: '#000000',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 375,
        md: 810,
        lg: 1200,
        xl: 1536,
      }
    }
  }), [paletteMode])


  const storeLocalData = (summonerStorageObject) => {
    window.localStorage.setItem('AramSummonerStorageObject', JSON.stringify(summonerStorageObject))
  }
  //console.log('rendering storage object', summonerStorageObject)

  return (
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <AppBar position='static' sx={{ mb: 2}}>
          <Toolbar>
          <Typography variant='h6' component='div' align='center' sx={{ flexGrow: 1 }} >3v3 ARAM random champ generator EUW</Typography>
          <IconButton onClick={() => setPaletteMode(paletteMode === 'dark' ? 'light' : 'dark')}>{paletteMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
          </Toolbar>
        </AppBar>
        <SnackbarContextProvider>
          <SummonerContextProvider>
            <TeamlistContextProvider>
              <Container sx={{ }} >
                <Grid container spacing={1} justifyContent='center' alignItems='flex-start' align='center' alignContent='center'>
                  <MasterySettings />
                  <Lobby />
                </Grid>
              </Container>
                <SnackbarDisplay />
            </TeamlistContextProvider>
          </SummonerContextProvider>
        </SnackbarContextProvider>
    </ThemeProvider>
  )


}

export default App
