import {  Typography, Stack, TextField, Button, Container, Grid, Snackbar, IconButton, Alert, AppBar, Toolbar, Switch } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import React, { useEffect, useMemo, useState } from 'react'
import championService from './services/championService'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import socketService from './services/socketService'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom'
import Lobby from './components/Lobby'
import { SummonerContext } from './contexts/summonerContext'

function App() {

  const [ paletteMode, setPaletteMode ] = useState('dark')
  const [ summonerStorageObject, setSummonerStorageObject ] = useState({
    summoners: {
    },
    lists: {
      'team1': {
        id: 'team1',
        summoners: []
      },
      'team2': {
        id: 'team2',
        summoners: []
      }
    },
    listOrder: ['team1', 'team2']
  })

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














 







  return (
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <SummonerContext.Provider value={{ summonerStorageObject, setSummonerStorageObject }}>
        <AppBar position='static' sx={{ mb: 2}}>
          <Toolbar>
          <Typography variant='h6' component='div' align='center' sx={{ flexGrow: 1 }} >3v3 ARAM random champ generator EUW</Typography>
          <IconButton onClick={() => setPaletteMode(paletteMode === 'dark' ? 'light' : 'dark')}>{paletteMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
          </Toolbar>
        </AppBar>
        <Container sx={{ }} >
          <Router>
            <Routes>
              <Route path='/' element={
                <div>
                  Main page
                </div>
              }>
              </Route>
              <Route path='lobby' element={<Lobby />}>
              </Route>
            </Routes>
          </Router>
        </Container>
        </SummonerContext.Provider>
    </ThemeProvider>
  )


}

export default App
