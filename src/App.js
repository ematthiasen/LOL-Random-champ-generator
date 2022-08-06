import {  Typography, Stack, TextField, Button, Container, Grid, Snackbar, IconButton, Alert, AppBar, Toolbar } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import React, { useEffect, useMemo, useState } from 'react'
import championService from './services/championService'
import summonerService from './services/summonerService'
import TeamList from './components/TeamList'
import { DragDropContext } from 'react-beautiful-dnd'
import CloseIcon from '@mui/icons-material/Close'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

function App() {
  const [ champList, setChampList ] = useState([])
  const [ summonerName, setSummonerName] = useState('')
  const [ minMasteryCutoff, setMinMasteryCutoff ] = useState(0)
  const [ maxMasteryCutoff, setMaxMasteryCutoff ] = useState(999999)

  const [ snackbarList, setSnackbarList ] = useState([])
  const [ snackbarOpen, setSnackbarOpen ] = useState(false)
  const [ snackbarMessage, setSnackbarMessage ] = useState(undefined)

  const [ paletteMode, setPaletteMode ] = useState('dark')

  const [ summonerStorageObject, setSummonerStorageObject ] = useState({
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
    console.log('loading effect')
    championService.getChampions()
      .then(champArray => {
        //console.log('setting champ List', champArray)
        setChampList(champArray)
        
        console.log('champions data')
        console.log(champArray)
      })

  }, [])

  useEffect(() => {
    const savedSummonerStorageObject = window.localStorage.getItem('AramSummonerStorageObject')
    if(savedSummonerStorageObject) {
      console.log('found summoner storage Object', savedSummonerStorageObject)
      const savedSummonersData = JSON.parse(savedSummonerStorageObject)
      setSummonerStorageObject(savedSummonersData)      
    }
  }, [])

  //Snackbar notifications
  useEffect (() => {
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
    setMinMasteryCutoff(event.target.value)
    console.log(summonerStorageObject.summoners)
    // update filteredMasteries data for summoners

    const updatedSummonerStorage = {
      ...summonerStorageObject
    }

    for (const [key, summoner] of Object.entries(summonerStorageObject.summoners)) {
      const newFilteredMasteries = summoner.masteries.filter(champ => maxMasteryCutoff > champ.championPoints && champ.championPoints > event.target.value )
      console.log('summoner', summoner.name)
      updatedSummonerStorage.summoners[key].filteredMasteries = newFilteredMasteries
    }

    storeLocalData(updatedSummonerStorage)
    setSummonerStorageObject(
      updatedSummonerStorage
    )
  }

  const handleMaxMasteryCutoff = (event) => {
    event.preventDefault()
    setMaxMasteryCutoff(event.target.value)
    console.log(summonerStorageObject.summoners)
    // update filteredMasteries data for summoners

    const updatedSummonerStorage = {
      ...summonerStorageObject
    }

    for (const [key, summoner] of Object.entries(summonerStorageObject.summoners)) {
      const newFilteredMasteries = summoner.masteries.filter(champ => event.target.value > champ.championPoints && champ.championPoints > minMasteryCutoff )
      console.log('summoner', summoner.name)
      updatedSummonerStorage.summoners[key].filteredMasteries = newFilteredMasteries
    }

    storeLocalData(updatedSummonerStorage)
    setSummonerStorageObject(
      updatedSummonerStorage
    )
  }

  
 
  const handleLoadSummoner = async (event) => {
    event.preventDefault()
    console.log('starting load summoner call')
    const summonerData = await summonerService.getSummoner(summonerName)
    if (summonerData === null){
      console.log('summoner not found')
      displaySnackbarMessage('Unable to load summoner', 'warning')
      return
    }

    //console.log('returned', summonerData)
    const masteries = await summonerService.getSummonerMasteries(summonerData.id)
    //console.log(masteries)
    if (masteries === null){
      console.log(`masteries for summoner ${summonerData.name} not found`)
      displaySnackbarMessage('Unable to load summoner masteries', 'warning')
      return
    }
    //populate masteries data with more champ information
    masteries.map(masteryChamp => {
      //find champ in champlist
      const currentChamp = champList.find(champ => Number(champ.key) === masteryChamp.championId)
      masteryChamp.name = currentChamp.name
      masteryChamp.image = currentChamp.image
      masteryChamp.tags = currentChamp.tags
      return null
    })

    const filteredMasteries = masteries.filter(champ => maxMasteryCutoff > champ.championPoints && champ.championPoints > minMasteryCutoff )
    console.log(minMasteryCutoff, maxMasteryCutoff)
    console.log('champs before  filter', masteries.length)
    console.log('champs after filter', filteredMasteries.length)


    const newSummoner = {
      ...summonerData,
      masteries,
      filteredMasteries,
      randomChamps: [null, null, null]
    }

        const updatedSummonerStorage = {
      ...summonerStorageObject,
    }
    
    //console.log('Keys:', Object.keys(summonerStorageObject.summoners))
    
    //check if already in dataObject
    if(summonerStorageObject.summoners.hasOwnProperty(newSummoner.id)) {
      console.log('already in summonerlist, checking if in list')

      let summonerInList = false
      for (const key of Object.keys(summonerStorageObject.lists)) {
        const returnValue = summonerStorageObject.lists[key].summoners.find(e => e === newSummoner.id)
        if(returnValue !== undefined) {
          summonerInList = true
          console.log(`summoner found in list: ${key}`)
        }

      }
      if(summonerInList) {
        console.log('summoner already in a list')
        return
      } else {
        console.log('summoner not in a list, adding to an empty list slot')
      }
    }
    updatedSummonerStorage.summoners[newSummoner.id] = newSummoner

    if (updatedSummonerStorage.lists['team1'].summoners.length < 3){
      updatedSummonerStorage.lists['team1'].summoners.push(newSummoner.id)
    } else if (updatedSummonerStorage.lists['team2'].summoners.length < 3) {
      updatedSummonerStorage.lists['team2'].summoners.push(newSummoner.id)
    } else {
      updatedSummonerStorage.lists['bench'].summoners.push(newSummoner.id)
    }
        
    console.log('Old summoner storage', summonerStorageObject)
    console.log('New summoner storage', updatedSummonerStorage)

    storeLocalData(updatedSummonerStorage)
    setSummonerStorageObject(
      updatedSummonerStorage
    )
    displaySnackbarMessage(`loaded summoner ${newSummoner.name}`, 'success')

  }

  const handleRollSummoner = (summonerId) => {
    const randomChamps = rollSummoner(summonerId)

    console.log('received rolled champs', randomChamps)

    const updatedSummonerStorage = {
      ...summonerStorageObject,
    }

    updatedSummonerStorage.summoners[summonerId].randomChamps = randomChamps
    setSummonerStorageObject(updatedSummonerStorage)
  }



  const rollSummoner = (summonerId) => {
    const currentSummoner = summonerStorageObject.summoners[summonerId]
    console.log(`rolling for summoner ${currentSummoner.name}, available champs: ${currentSummoner.filteredMasteries.length}`)
    
    //TODO: implement criteria for valid rolls.
    //for example, if preference for fighter, mage or tank is set, check that the champ fulfill the criteria
    // or if a minimum of mastery level is allowed

    const availableChamps = Array.from(currentSummoner.filteredMasteries)
    //console.log('available champs', availableChamps, availableChamps.length)
    const randomChampArray = [null, null, null]

    const rolledChamps = randomChampArray.map((slot, index) => {
      //console.log('index', index)
      //console.log('available champs', availableChamps.length)
      if(availableChamps.length > 0) {
        const champId = availableChamps[Math.floor(Math.random() * availableChamps.length)].championId
        //console.log('rolled', champId)
        //console.log('removind index', availableChamps.findIndex(e => e.championId === champId), 1)
        availableChamps.splice(availableChamps.findIndex(e => e.championId === champId), 1)
        return champId
      } else {
        return null
      }
    })

    console.log('rolled champs', rolledChamps)
    return rolledChamps


  }


  const rollTeam = (listId) => {
    console.log(`rolling random ${listId}`)
    //for summoners in team 1 list
    summonerStorageObject.lists[listId].summoners.map((summonerId) => {
      const rolledChamps = rollSummoner(summonerId)
      //TODO: implement criteria for valid rolls.
      //for example, if preference for fighter, mage or tank is set, check that the champ fulfill the criteria
      // or if a minimum of mastery level is allowed

      const updatedSummonerStorage = {
        ...summonerStorageObject,
      }

      updatedSummonerStorage.summoners[summonerId].randomChamps = rolledChamps
      setSummonerStorageObject(updatedSummonerStorage)

      return null
    })
  }


  const getChampionData = (championId) => {
    //console.log('checking id', championId)
    const champ = champList.find((champ) => Number(champ.key) === championId)
    //console.log('Champ', champ)
    return champ
  }


  const storeLocalData = (summonerStorageObject) => {
    window.localStorage.setItem('AramSummonerStorageObject', JSON.stringify(summonerStorageObject))
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
      console.log('destination empty, deleting')
      const sourceList = summonerStorageObject.lists[source.droppableId]
      const sourceListOrder = Array.from(sourceList.summoners)
      sourceListOrder.splice(source.index, 1)

      const newSourceList = {
        ...sourceList,
        summoners: sourceListOrder
      }
      
      const newSummonerList = {
        ...summonerStorageObject.summoners
      }
      delete newSummonerList[draggableId]


      const newStorageObject = {
        ...summonerStorageObject,
        summoners: newSummonerList,
        lists: {
          ...summonerStorageObject.lists,
          [newSourceList.id]: newSourceList
        }
      }
      
      storeLocalData(newStorageObject)
      setSummonerStorageObject(newStorageObject)
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
  
      const newStorageObject = {
        ...summonerStorageObject,
        lists: {
          ...summonerStorageObject.lists,
          [newDestinationList.id]: newDestinationList,
        }
      }
      console.log('result of move: ', newStorageObject)
  
      storeLocalData(newStorageObject)
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
  
      const newDestinationList = {
        ...destinationList,
        summoners: destinationListOrder
      }
  
      const newStorageObject = {
        ...summonerStorageObject,
        lists: {
          ...summonerStorageObject.lists,
          [newDestinationList.id]: newDestinationList,
          [newSourceList.id]: newSourceList
        }
      }
      console.log('result of move: ', newStorageObject)
  
      storeLocalData(newStorageObject)
      setSummonerStorageObject(newStorageObject)
    }
  }

  const deleteSummoner = (summonerId) => {
    console.log('delete summoner', summonerId)

    const newSummonerList = {
      ...summonerStorageObject.summoners
    }
    delete newSummonerList[summonerId]

    const newStorageObject = {
      ...summonerStorageObject,
      summoners: newSummonerList,
      lists: {
        ...summonerStorageObject.lists,
      }
    }

    for (const list of Object.values(summonerStorageObject.lists)){
      const index = list.summoners.findIndex((summoner) => summoner === summonerId)
      if (index !== -1){
        console.log('hit in list', list.id, 'on index', index)

        const newList = Array.from(list.summoners)
        newList.splice(index, 1)
        console.log('newlist', newList)
        console.log('oldlist', list.summoners)
        newStorageObject.lists[list.id].summoners = newList
      }
    }

    storeLocalData(newStorageObject)
    setSummonerStorageObject(newStorageObject)
    displaySnackbarMessage('Deleted summoner', 'success')

  }


  console.log('rendering storage object', summonerStorageObject)

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
                  <Button id='load-summoner' onClick={handleLoadSummoner} variant='outlined'>Load</Button>
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
