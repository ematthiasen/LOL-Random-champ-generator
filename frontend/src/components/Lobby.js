import { Alert, Button, Grid, IconButton, Snackbar, Stack, TextField, CircularProgress } from "@mui/material";
import { useMemo, useState, useEffect, useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useLocation } from "react-router-dom";
import TeamList from "./TeamList";
import CloseIcon from '@mui/icons-material/Close'
import socketService from '../services/socketService'
import { SummonerContext } from "../contexts/summonerContext";
import championService from '../services/championService'

const Lobby = () => {
  const [ champList, setChampList ] = useState([])


  //Form input related
  const [ summonerName, setSummonerName] = useState('')
  const [ minMasteryCutoff, setMinMasteryCutoff ] = useState(0)
  const [ maxMasteryCutoff, setMaxMasteryCutoff ] = useState(999999)
  const [ summonerLoading, setSummonerLoading ] = useState(false)

  //Snackbar related
  const [ snackbarList, setSnackbarList ] = useState([])
  const [ snackbarOpen, setSnackbarOpen ] = useState(false)
  const [ snackbarMessage, setSnackbarMessage ] = useState(undefined)

  const { summonerStorageObject, setSummonerStorageObject } = useContext(SummonerContext)

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

  const handleMinMasteryCutoff = (event) => {
    event.preventDefault()
    socketService.sendMinMasteryCutoff(event.target.value)
  }

  const handleMaxMasteryCutoff = (event) => {
    event.preventDefault()
    socketService.sendMaxMasteryCutoff(event.target.value)
  
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


  //connect to socket server and get updated summoner data object
  useEffect(() => {
    socketService.socketConnect(setSummonerStorageObject, setSummonerLoading, displaySnackbarMessage, setMinMasteryCutoff, setMaxMasteryCutoff)
  },[])

  function useQuery() {
    const { search } = useLocation()
  
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery()
  const lobbyId = query.get('id')
  // socket join serverLobby
  


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

  const handleLoadSummoner = async (event) => {
    event.preventDefault()
    console.log('starting load summoner call')

    setSummonerLoading(true)

    socketService.sendLoadSummoner(summonerName)


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