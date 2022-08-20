import { Box, Stack, Typography, ListItem, ListItemButton, Tooltip, IconButton, CircularProgress } from "@mui/material"
import { Draggable } from "react-beautiful-dnd"
import assassin from '../images/assassin.png'
import fighter from '../images/fighter.png'
import mage from '../images/mage.png'
import marksman from '../images/marksman.png'
import support from '../images/support.png'
import tank from '../images/tank.png'
import { v4 as uuidv4 } from 'uuid'
import DeleteIcon from '@mui/icons-material/Delete'
import RerollIcon from '@mui/icons-material/Replay'
import SettingsIcon from '@mui/icons-material/MoreVert'
import { useSummonerContext } from "../contexts/summonerContext"
import { useTeamlistContext } from "../contexts/teamlistContext"
import { useSnackbarContext } from "../contexts/snackbarContext"
import ChampImage from "./ChampImage"

const Summoner = ({summoner, index }) => {

  const [ , , , rollSummoner, deleteSummoner ] = useSummonerContext()
  const [ , , , deleteSummonerFromTeamlist ] = useTeamlistContext()

  const { displaySnackbarMessage } = useSnackbarContext()

  const roleTypes = {
    'Assassin': {
      image: assassin,
      tooltip: 'Assassin'
    },
    'Fighter': {
      image: fighter,
      tooltip: 'Fighter'
    },
    'Mage': {
      image: mage,
      tooltip: 'Mage'
    },
    'Marksman': {
      image: marksman,
      tooltip: 'Marksman'
    },
    'Support': {
      image: support,
      tooltip: 'Support'
    },
    'Tank': {
      image: tank,
      tooltip: 'Tank'
    }
  }

  const handleRollSummoner = () => {
    rollSummoner(summoner)
    //no longer needed, localstorage handled in context
    //window.localStorage.setItem('AramSummonerStorageObject', JSON.stringify({ storedSummoners: newSummoners, storedTeamlist: teamlist }))
  }

  const handleDeleteSummoner = () => {
    //const newTeamlist = deleteSummonerFromTeamlist(summoner.id)
    deleteSummonerFromTeamlist(summoner.id)
    //const newSummoners = deleteSummoner(summoner.id)
    deleteSummoner(summoner.id)
    //no longer needed, localstorage handled in context
    //window.localStorage.setItem('AramSummonerStorageObject', JSON.stringify({ storedSummoners: newSummoners, storedTeamlist: newTeamlist }))
    displaySnackbarMessage(`Summoner ${summoner.name} was successfully deleted`, 'success' )
  }

  const champImageColumnSize = 75

  return (
    <Draggable draggableId={summoner.id} index={index}>
      {(provided) => (
        <ListItem
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          disablePadding
        >
          <ListItemButton sx={{ p: {xs: 1, md: 2}}}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' flexGrow={1} spacing={0} >
              
              <Box>
                <Typography variant='body1'>{summoner.name}</Typography>
                <Typography variant='caption'>Champ pool:</Typography>
                <Typography variant='caption'>{summoner.filteredMasteries.length}</Typography>
                <Box>
                  <Tooltip title='remove summoner'>
                    <IconButton onClick={() => handleDeleteSummoner()}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Reroll champions for this summoner'>
                    <IconButton onClick={() => handleRollSummoner()}>
                      <RerollIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Edit summoner specific settings'>
                    <IconButton onClick={() => console.log('test')}>
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 0, md: 1}} >
                {summoner.randomChamps.map((champId, index) => {
                  if(champId !== null) {
                    const champ = summoner.masteries.find((champ) => champ.championId === Number(champId))
                    return (
                      <Stack key={uuidv4()} alignItems={{ xs: 'flex-start', md: 'center'}} width={{ xs: 175, md: champImageColumnSize}} >
                        <ChampImage champ={champ} size={champImageColumnSize} />
                        <Typography variant='caption' align='center' >{index+1}: {champ.name}</Typography>
                        <Stack direction='row' justifyContent='center'>
                          {champ.tags.map((tag) => (
                            <Tooltip display={{ xs: 'none', md: 'block' }} key={uuidv4()} title={roleTypes[tag].tooltip}>
                              <Box component='img' sx={{ height: 20, width: 20 }} alt={roleTypes[tag].tooltip} src={roleTypes[tag].image} />
                            </Tooltip>

                          ))}
                          </Stack>
                          <Typography display={{ xs: 'none', md: 'block' }} variant='caption'>P: {champ.championPoints}</Typography>
                      </Stack>
                      
                    )
                  } else {
                    return (
                      <Stack key={uuidv4()} alignItems='center' width={80}>
                        <Box display={{ xs: 'none', md: 'flex' }} sx={{ height: 80, width: 80, bgcolor: 'black' }} alignItems='center' justifyContent='center'><Typography variant='h6' align='center' color='white' >?</Typography></Box>
                        <Typography variant='body2' align='center'>{index+1}: ?</Typography>
                      </Stack>
                    )
                  }
                })}
              </Stack>
            </Stack>
          </ListItemButton>
        </ListItem>
      )}

    </Draggable>
  )
}

export default Summoner
