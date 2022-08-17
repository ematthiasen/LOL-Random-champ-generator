import { Alert, Button, Grid, IconButton, Snackbar, Stack, TextField, CircularProgress } from "@mui/material"
import { useMemo, useState, useEffect, useContext } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useLocation } from "react-router-dom"
import TeamList from "./TeamList"
import CloseIcon from '@mui/icons-material/Close'
import socketService from '../services/socketService'
import championService from '../services/championService'
import { useSummonerContext } from "../contexts/summonerContext"
import { useTeamlistContext } from "../contexts/teamlistContext"
import summonerService from '../services/summonerService'

const Lobby = () => {
  const [ summoners, setSummoners ] = useSummonerContext()
  const [ teamlist, setTeamlist ] = useTeamlistContext()

  const [ champList, setChampList ] = useState([])


  //Form input related
  const [ summonerName, setSummonerName] = useState('')

  const [ summonerLoading, setSummonerLoading ] = useState(false)

  //Snackbar related
  const [ snackbarList, setSnackbarList ] = useState([])
  const [ snackbarOpen, setSnackbarOpen ] = useState(false)
  const [ snackbarMessage, setSnackbarMessage ] = useState(undefined)

  

  //champlist
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

  const handleRollSummoner = (summonerId) => {
    socketService.sendRollSummoner(summonerId)
  }

  const rollTeam = (listId) => {
    console.log(`rolling random ${listId}`)
    socketService.sendRollTeam(listId)
  }
  
  const deleteSummoner = (summonerId) => {
    console.log('delete summoner', summonerId)
    socketService.sendDeleteSummoner(summonerId)
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

      // Changed to use contextprovider.
      const destinationList = teamlist[destination.droppableId]
      const destinationListOrder = Array.from(destinationList.summoners)
  
      destinationListOrder.splice(source.index, 1)
      destinationListOrder.splice(destination.index, 0, draggableId)

      const newDestinationList = {
        ...destinationList,
        summoners: destinationListOrder
      }
    
      const updatedLists= {
        ...teamlist,
        [newDestinationList.id]: newDestinationList,
      }

      console.log('result of move: ', updatedLists)
      setTeamlist(updatedLists)

    } else {
      console.log('movement between lists')
      const sourceList = teamlist[source.droppableId]
      const destinationList = teamlist[destination.droppableId]
  
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
        ...teamlist,
        [newDestinationList.id]: newDestinationList,
        [newSourceList.id]: newSourceList
      }
      
      console.log('result of move: ', updatedLists)
      setTeamlist(updatedLists)
    }
    
  }


  const handleLoadSummoner = async (event) => {
    event.preventDefault()
    console.log('starting load summoner call')

    /* Spin loading button
    const [ summonerLoading, setSummonerLoading ] = useState(false)
    */
    setSummonerLoading(true)

    const summonerData = await summonerService.getSummoner(summonerName)
    if (summonerData === null){
      console.log('summoner not found')
      displaySnackbarMessage('Unable to load summoner', 'warning')
      setSummonerLoading(false)
      return
    }

    //console.log('returned', summonerData)
    const masteries = await summonerService.getSummonerMasteries(summonerData.id)
    //console.log(masteries)
    if (masteries === null){
      console.log(`masteries for summoner ${summonerData.name} not found`)
      displaySnackbarMessage('Unable to load summoner masteries', 'warning')
      setSummonerLoading(false)
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
        setSummonerLoading(false)
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
      // do not use bench, abort loading instead
      displaySnackbarMessage(`Roster is full, no room for ${newSummoner.name}. Make room and try again`, 'error')
      setSummonerLoading(false)
      return
      //updatedSummonerStorage.lists['bench'].summoners.push(newSummoner.id)
    }
        
    console.log('Old summoner storage', summonerStorageObject)
    console.log('New summoner storage', updatedSummonerStorage)

    storeLocalData(updatedSummonerStorage)
    setSummonerStorageObject(
      updatedSummonerStorage
    )
    displaySnackbarMessage(`loaded summoner ${newSummoner.name}`, 'success')
    setSummonerLoading(false)

  }





  if (champList.length === 0) {
    console.log('champlist not yet loaded')
    return <div>Waiting</div>
  } else if(!lobbyId)
    return (
      <div>No lobby specified.
        Back
        Cancel
        Whatever
      </div>
    )
  else
    return (
        <>
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

    </>
    )
}

export default Lobby