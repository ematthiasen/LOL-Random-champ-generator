import { Card, Paper, Grid, Typography, Stack, TextField, Button } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useEffect, useState } from 'react'
import championService from './services/championService'
import summonerService from './services/summonerService'
import Summoner from './components/Summoner'
import TeamList from './components/TeamList'
import { DragDropContext } from 'react-beautiful-dnd'

function App() {
  const [ champList, setChampList ] = useState([])
  const [ summonerName, setSummonerName] = useState('')
  const [ summonerList, setSummonerList] = useState([])

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
      })

  }, [])

  useEffect(() => {
    const savedSummonerStorageObject = window.localStorage.getItem('AramSummonerStorageObject')
    if(savedSummonerStorageObject) {
      console.log('found summoner storage Object', savedSummonerStorageObject)
      const savedSummonersData = JSON.parse(savedSummonerStorageObject)
      setSummonerList(savedSummonersData)      
    }
  }, [])

  console.log('after useEffects, check status on data, make sure components are not rendered before data is ready')


  if (champList.length === 0) {
    console.log('champlist not yet loaded')
    return <div>Waiting</div>
  }
  



  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  const handleLoadSummoner = async () => {
    console.log('starting load summoner call')
    const summonerData = await summonerService.getSummoner(summonerName)
    console.log('returned', summonerData)
    const masteries = await summonerService.getSummonerMasteries(summonerData.id)
    console.log(masteries)


    const newSummoner = {
      ...summonerData,
      masteries
    }
    //check if summoner is already in list, if so replace.

    const updatedSummonerStorage = {
      ...summonerStorageObject,
    }
    updatedSummonerStorage.summoners[newSummoner.id] = newSummoner
    updatedSummonerStorage.lists['bench'].summoners.push(newSummoner.id)
    console.log('Old summoner storage', summonerStorageObject)
    console.log('New summoner storage', updatedSummonerStorage)

    setSummonerStorageObject(
      updatedSummonerStorage
    )

    //Set new summonerlist in local storage
    //window.localStorage.setItem('AramSummonerList', JSON.stringify(summonerList.concat(newSummoner)))

    //setSummonerList(summonerList.concat(newSummoner))


    //remove data:
    //window.localStorage.removeItem('AramSummonerList')

  }

  const getChampionData = (championId) => {
    console.log('checking id', championId)
    const champ = champList.find((champ) => Number(champ.key) === championId)
    console.log('Champ', champ)
    return champ
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId} = result

    if(!destination) {
      //delete
    }

    if( destination.droppableId === source.droppableId && destination.index === source.index ) {
      //not moved
      return
    }

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

    setSummonerStorageObject(newStorageObject)

  }


  console.log('rendering storage object', summonerStorageObject)

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <Grid container justifyContent='center'>
          <Paper variant={2} sx={{ p:2 }}>
              <Typography variant='h5'>Summoner lookup</Typography>
              <Card sx={{ p: 2 }}>
                <Stack direction='row'>
                  <TextField id='summoner-name' label='Summoner name' variant='outlined' value={summonerName} onChange={(event) => setSummonerName(event.target.value)} />
                  <Button id='load-summoner' onClick={handleLoadSummoner}>Load</Button>
                </Stack>
              </Card>
              <DragDropContext
                onDragEnd={onDragEnd}>
              <Card>
                <Typography variant='h6' sx={{ px: 1, pt: 1 }}>Bench</Typography>
                <TeamList key={summonerStorageObject.lists['bench'].id} teamList={summonerStorageObject.lists['bench']} summoners={summonerStorageObject.summoners} getChampData={getChampionData} />
              </Card>
              <Stack direction='row'>
                {summonerStorageObject.listOrder.map(listId => {
                  const list = summonerStorageObject.lists[listId]
                  return  (
                    <Card key={list.id} width={300}>
                      <Typography variant='h6' sx={{ padding: 2 }}>{list.id}</Typography>
                      <TeamList teamList={list} summoners={summonerStorageObject.summoners} getChampData={getChampionData}/>
                    </Card>
                  )
                }
                  
                )}
              </Stack>

              
              </DragDropContext>
          </Paper>
        </Grid>
    </ThemeProvider>
  )


}

export default App
