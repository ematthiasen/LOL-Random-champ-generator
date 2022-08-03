import {  Typography, Stack, TextField, Button, Box, Grid } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useEffect, useState } from 'react'
import championService from './services/championService'
import summonerService from './services/summonerService'
import TeamList from './components/TeamList'
import BenchList from './components/BenchList'
import { DragDropContext } from 'react-beautiful-dnd'

function App() {
  const [ champList, setChampList ] = useState([])
  const [ summonerName, setSummonerName] = useState('')
  const [ minMasteryCutoff, setMinMasteryCutoff ] = useState(0)
  const [ maxMasteryCutoff, setMaxMasteryCutoff ] = useState(999999)

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
      return
    }

    //console.log('returned', summonerData)
    const masteries = await summonerService.getSummonerMasteries(summonerData.id)
    //console.log(masteries)

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

  }

  const rollTeam = (listId) => {
    console.log(`rolling random ${listId}`)
    //for summoners in team 1 list
    summonerStorageObject.lists[listId].summoners.map((summonerId) => {
      const currentSummoner = summonerStorageObject.summoners[summonerId]
      console.log(`rolling for summoner ${currentSummoner.name}`)
      const randomNumber = Math.floor(Math.random() * currentSummoner.masteries.length)
      
      const randomChamp = currentSummoner.masteries[randomNumber]
      //TODO: implement criteria for valid rolls.
      //for example, if preference for fighter, mage or tank is set, check that the champ fulfill the criteria
      // or if a minimum of mastery level is allowed


      console.log(randomChamp.championId)
      const randomChampArray = [
        currentSummoner.filteredMasteries[Math.floor(Math.random() * currentSummoner.filteredMasteries.length)].championId,
        currentSummoner.filteredMasteries[Math.floor(Math.random() * currentSummoner.filteredMasteries.length)].championId,
        currentSummoner.filteredMasteries[Math.floor(Math.random() * currentSummoner.filteredMasteries.length)].championId,
      ]
      console.log(randomChampArray)
      
      //update summoner Storage object here.
      const updatedSummonerStorage = {
        ...summonerStorageObject,
      }

      updatedSummonerStorage.summoners[currentSummoner.id].randomChamps = randomChampArray
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


  console.log('rendering storage object', summonerStorageObject)

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  /*
  const lightTheme = createTheme({
    palette: {
      mode: 'light'
    }
  })
*/
  const drawerWidth=200

  return (
    <Box sx={{ height: '100vh'}} justifyContent='left'>
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Grid container spacing={2} sx={{ height: 1 }}>
    <DragDropContext onDragEnd={onDragEnd}>

      <Grid item sx={{ height: 1 }}>
        <BenchList key={summonerStorageObject.lists['bench'].id} teamList={summonerStorageObject.lists['bench']} summoners={summonerStorageObject.summoners} getChampData={getChampionData} drawerWidth={drawerWidth} />
      </Grid>

      <Grid item flexGrow={9} sx={{ bgcolor: '#1c1c1c'}}>
      <Typography variant='h5' align='center' sx={{ py: 2 }}>3v3 ARAM random champ generator EUW</Typography>
      <form onSubmit={handleLoadSummoner}>
        <Stack direction='row' justifyContent='center' spacing={10} sx={{ pb:2 }}>
          <Button variant='contained' onClick={() => rollTeam('team1')}>Roll Team 1</Button>
          <Stack direction='row'>
            <TextField id='summoner-name' label='Summoner name' variant='outlined' value={summonerName} onChange={(event) => setSummonerName(event.target.value)} />
            <Button id='load-summoner' sx={{ maxWidth:30 }} onClick={handleLoadSummoner} variant='outlined'>Load</Button>
          </Stack>
          <Button variant='contained' onClick={() => rollTeam('team2')}>Roll Team 2</Button>
        </Stack>
      </form>
      <Stack direction='row' justifyContent='center' spacing={10} sx={{ pb:2 }}>
        <TextField id='mastery-minimum-point-cutoff' type='number' label='Minimum mastery points' variant='outlined' value={minMasteryCutoff} onChange={handleMinMasteryCutoff} />
        <TextField id='mastery-maximum-point-cutoff' type='number' label='Maximum mastery points' variant='outlined' value={maxMasteryCutoff} onChange={handleMaxMasteryCutoff} />
      </Stack>
        <br />
        <Grid container justifyContent='center'>
        {summonerStorageObject.listOrder.map(listId => {
          const list = summonerStorageObject.lists[listId]
          return  (
            <Grid item key={listId} sx={{ bgcolor: '#2a2a2a', m: 1}}>
              <TeamList key={listId} teamList={list} summoners={summonerStorageObject.summoners} getChampData={getChampionData} direction='vertical'/>
            </Grid>
          )
          }      
        )}
        </Grid>
      </Grid>
      </DragDropContext>
        


        
      </Grid>
      </ThemeProvider>
      </Box>
  )


}

export default App
