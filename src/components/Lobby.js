import { Button, Grid, } from "@mui/material"
import { useState, useEffect } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import TeamList from "./TeamList"
import championService from '../services/championService'
import { useSummonerContext } from "../contexts/summonerContext"
import { useTeamlistContext } from "../contexts/teamlistContext"
import { useSnackbarContext } from "../contexts/snackbarContext"
import SummonerLoadingPanel from "./SummonerLoadingPanel"


const Lobby = () => {
  const [ summoners, setSummoners ] = useSummonerContext()
  const [ teamlist, setTeamlist ] = useTeamlistContext()

  const [ champList, setChampList ] = useState([])


  //Form input related
  const [ summonerName, setSummonerName] = useState('')

  const [ summonerLoading, setSummonerLoading ] = useState(false)

  

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

  // update for new states.
  useEffect(() => {
    const savedSummonerStorageObject = window.localStorage.getItem('AramSummonerStorageObject')
    if(savedSummonerStorageObject) {
      console.log('found summoner storage Object', savedSummonerStorageObject)
      const savedSummonersData = JSON.parse(savedSummonerStorageObject)
      const { storedSummoners, storedTeamlist } = savedSummonersData
      setSummoners(storedSummoners)
      setTeamlist(storedTeamlist)  
    }
  }, [])

  const { displaySnackbarMessage } = useSnackbarContext()

  
  const handleRollSummoner = (summonerId) => {
    //fix
    //socketService.sendRollSummoner(summonerId)
  }

  const rollTeam = (listId) => {
    console.log(`rolling random ${listId}`)
    //fix
    //fixsocketService.sendRollTeam(listId)
  }
  
  const deleteSummoner = (summonerId) => {
    console.log('delete summoner', summonerId)
    //fix
    //socketService.sendDeleteSummoner(summonerId)
  }

  const getChampionData = (championId) => {
    //console.log('checking id', championId)
    const champ = champList.find((champ) => Number(champ.key) === championId)
    //console.log('Champ', champ)
    return champ
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

  if (champList.length === 0) {
    console.log('champlist not yet loaded')
    return <div>Waiting for champions to load</div>
  } else 
  return (
        <>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid item display='flex' xs={6} md={3} order={{ xs:3, md: 2 }} sx={{ p: 1, }} justifyContent='right'>
            <Button variant='contained' onClick={() => rollTeam('team1')} sx={{ }} >Roll Team 1</Button>
          </Grid>
          <SummonerLoadingPanel champList={champList} />
          <Grid item display='flex' xs={6} md={3} order={{ xs: 3, md: 2 }} sx={{ p: 1}}  justifyContent='left'>
            <Button variant='contained' onClick={() => rollTeam('team2')}>Roll Team 2</Button>
          </Grid>
          <br />
            {['team1', 'team2'].map(listId => {
              const list = teamlist[listId]
              return  (
                <TeamList
                  key={listId} 
                  teamList={list} 
                  summoners={summoners} 
                  getChampData={getChampionData} 
                  deleteSummoner={deleteSummoner} 
                  handleRollSummoner={handleRollSummoner} 
                  direction='vertical'
                />
              )
            })}
        </DragDropContext>
    </>
    )
}

export default Lobby