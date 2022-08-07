import {  Typography, Stack, TextField, Button, Container, Grid, Snackbar, IconButton, Alert, AppBar, Toolbar, CircularProgress } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import React, { useEffect, useMemo, useState } from 'react'
import championService from './services/championService'
import TeamList from './components/TeamList'
import { DragDropContext } from 'react-beautiful-dnd'
import CloseIcon from '@mui/icons-material/Close'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import socketService from './services/socketService'

function App() {
  const [ champList, setChampList ] = useState([])
  const [ summonerName, setSummonerName] = useState('')
  const [ minMasteryCutoff, setMinMasteryCutoff ] = useState(0)
  const [ maxMasteryCutoff, setMaxMasteryCutoff ] = useState(999999)

  const [ snackbarList, setSnackbarList ] = useState([])
  const [ snackbarOpen, setSnackbarOpen ] = useState(false)
  const [ snackbarMessage, setSnackbarMessage ] = useState(undefined)

  const [ paletteMode, setPaletteMode ] = useState('dark')
  const [ summonerLoading, setSummonerLoading ] = useState(false)



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


  useEffect(() => {
    console.log('Useeffect get champions triggered')
    championService.getChampions()
      .then(champArray => {
        //console.log('setting champ List', champArray)
        setChampList(champArray)
        
        //console.log('champions data')
        console.log(champArray)
      })

  }, [])

  //connect to socket server and get updated summoner data object
  useEffect(() => {
    socketService.socketConnect(setSummonerStorageObject, setSummonerLoading, displaySnackbarMessage, setMinMasteryCutoff, setMaxMasteryCutoff)
  },[])

  //Snackbar notifications
  useEffect (() => {
    console.log('useEffect snackbar triggered')
    if (snackbarList.length && !snackbarMessage) {
      setSnackbarMessage({...snackbarList[0]})
      setSnackbarList((prev) => prev.slice(1))
      setSnackbarOpen(true)
      console.log('set snackbar Message', {...snackbarList[0]})
    } else if (snackbarList.length && snackbarMessage && snackbarOpen) {
      setSnackbarOpen(false)
    }
  }, [snackbarList, snackbarMessage, snackbarOpen]) 

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false)
  }

  const handleSnackbarExited = () => {
    setSnackbarMessage(undefined)
  }

  const displaySnackbarMessage = (message, type ) => {
    setSnackbarList((prev) => [...prev, { message, type }])
  }


  if (champList.length === 0) {
    console.log('champlist not yet loaded')
    return <div>Waiting</div>
  }


  const handleMinMasteryCutoff = (event) => {
    event.preventDefault()
    socketService.sendMinMasteryCutoff(event.target.value)
  }

  const handleMaxMasteryCutoff = (event) => {
    event.preventDefault()
    socketService.sendMaxMasteryCutoff(event.target.value)
  
  }
 
  const handleLoadSummoner = async (event) => {
    event.preventDefault()
    console.log('starting load summoner call')

    setSummonerLoading(true)

    socketService.sendLoadSummoner(summonerName)


    setSummonerLoading(false)

  }

  const handleRollSummoner = (summonerId) => {
    socketService.sendRollSummoner(summonerId)
  }

  const rollTeam = (listId) => {
    console.log(`rolling random ${listId}`)
    socketService.sendRollTeam(listId)
  }


  const getChampionData = (championId) => {
    //console.log('checking id', championId)
    const champ = champList.find((champ) => Number(champ.key) === championId)
    //console.log('Champ', champ)
    return champ
  }


  const clearDataAndStorage = () => {
    window.localStorage.removeItem('AramSummonerStorageObject')
    setSummonerStorageObject({
      summoners: {
      },
      lists: {
        'bench': {
          id: 'bench',
          summoners: []
        },
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
  }


  const onDragEnd = (result) => {
    const { destination, source, draggableId} = result
    console.log('source:', source)
    console.log('destination:', destination)
    console.log('draggable ID:', draggableId)

    if(!destination) {
      console.log('destination empty, ignoring')

      return
    }

    else if( destination.droppableId === source.droppableId && destination.index === source.index ) {
      console.log('no change, exiting')
      //not moved
      return
    }
    else if( destination.droppableId === source.droppableId) {
      console.log('movement within same list')

      const destinationList = summonerStorageObject.lists[destination.droppableId]
      const destinationListOrder = Array.from(destinationList.summoners)
  
      destinationListOrder.splice(source.index, 1)
      destinationListOrder.splice(destination.index, 0, draggableId)

      const newDestinationList = {
        ...destinationList,
        summoners: destinationListOrder
      }
    
      const updatedLists= {
        ...summonerStorageObject.lists,
        [newDestinationList.id]: newDestinationList,
      }

      const newStorageObject = {
        ...summonerStorageObject,
        lists: updatedLists
      }
      
      console.log('result of move: ', updatedLists)
  
      socketService.sendUpdatedLists({
        updatedLists
      })

      setSummonerStorageObject(newStorageObject)

    } else {
      console.log('movement between lists')
      const sourceList = summonerStorageObject.lists[source.droppableId]
      const destinationList = summonerStorageObject.lists[destination.droppableId]
  
      const sourceListOrder = Array.from(sourceList.summoners)
      const destinationListOrder = Array.from(destinationList.summoners)
  
      sourceListOrder.splice(source.index, 1)
      destinationListOrder.splice(destination.index, 0, draggableId)
  
      const newSourceList = {
        ...sourceList,
        summoners: sourceListOrder
      }
      console.log('sourcelist', newSourceList)

      const newDestinationList = {
        ...destinationList,
        summoners: destinationListOrder
      }
      console.log('destinationList', newDestinationList)
      
      const updatedLists = {
        ...summonerStorageObject.lists,
        [newDestinationList.id]: newDestinationList,
        [newSourceList.id]: newSourceList
      }

      const newStorageObject = {
        ...summonerStorageObject,
        lists: updatedLists
      }
      
      console.log('result of move: ', updatedLists)
  
      socketService.sendUpdatedLists({
        updatedLists
      })
      setSummonerStorageObject(newStorageObject)
    }
    
  }

  const deleteSummoner = (summonerId) => {
    console.log('delete summoner', summonerId)
    socketService.sendDeleteSummoner(summonerId)
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
        <Container sx={{ }} >
        <Grid container spacing={1} justifyContent='center' alignItems='flex-start' align='center' alignContent='center'>
          <DragDropContext onDragEnd={onDragEnd}>
            <Grid item xs={12} order={1}>
        
              
            </Grid>
            <Grid item display='flex' xs={6} md={3} order={{ xs:3, md: 2 }} sx={{ p: 1, }} justifyContent='right'>
              <Button variant='contained' onClick={() => rollTeam('team1')} sx={{ }} >Roll Team 1</Button>
            </Grid>
            <Grid item flexShrink xs={12} md={6} order={{ xs: 2 }} >
              <form onSubmit={handleLoadSummoner}>
                <Stack direction='row' justifyContent='center' xs={8} >
                  <TextField id='summoner-name' label='Summoner name' variant='outlined' value={summonerName} onChange={(event) => setSummonerName(event.target.value)} />
                  <Button id='load-summoner' onClick={handleLoadSummoner} variant='outlined'>{summonerLoading ? <CircularProgress /> : 'Load'}</Button>
                  <Button variant='outlined' onClick={clearDataAndStorage} sx={{ ml: 2}}>Clear data</Button>
                </Stack>
              </form>

            </Grid>
            <Grid item display='flex' xs={6} md={3} order={{ xs: 3, md: 2 }} sx={{ p: 1}}  justifyContent='left'>
              <Button variant='contained' onClick={() => rollTeam('team2')}>Roll Team 2</Button>
            </Grid>
            <Grid item order={{ xs: 4 }} xs={12}>
              <TextField size='small' id='mastery-minimum-point-cutoff' type='number' label='Minimum mastery points' variant='outlined' value={minMasteryCutoff} onChange={handleMinMasteryCutoff} />
              <TextField size='small' id='mastery-maximum-point-cutoff' type='number' label='Maximum mastery points' variant='outlined' value={maxMasteryCutoff} onChange={handleMaxMasteryCutoff} />
            </Grid>
            <br />
            
              {summonerStorageObject.listOrder.map(listId => {
                const list = summonerStorageObject.lists[listId]
                return  (
                  <TeamList
                    key={listId} 
                    teamList={list} 
                    summoners={summonerStorageObject.summoners} 
                    getChampData={getChampionData} 
                    deleteSummoner={deleteSummoner} 
                    handleRollSummoner={handleRollSummoner} 
                    direction='vertical'
                  />
                )
              })}
            
          </DragDropContext>
        </Grid>
        <Snackbar
          key={snackbarMessage ? snackbarMessage.message : undefined}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose} 
          TransitionProps={{ onExited: handleSnackbarExited}}
        >
          <Alert severity={snackbarMessage ? snackbarMessage.type : undefined} action={<IconButton onClick={handleSnackbarClose}><CloseIcon /></IconButton>}>{snackbarMessage ? snackbarMessage.message : undefined}</Alert>
        </Snackbar>

      </Container>
    </ThemeProvider>
  )


}

export default App
