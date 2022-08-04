import { Box, Stack, Typography, ListItem, ListItemButton, Tooltip, IconButton } from "@mui/material"
import { Draggable } from "react-beautiful-dnd"
import assassin from '../images/assassin.png'
import fighter from '../images/fighter.png'
import mage from '../images/mage.png'
import marksman from '../images/marksman.png'
import support from '../images/support.png'
import tank from '../images/tank.png'
import { v4 as uuidv4 } from 'uuid'
import DeleteIcon from '@mui/icons-material/Delete'

const Summoner = ({summoner, index, deleteSummoner}) => {

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

  return (
    <Draggable draggableId={summoner.id} index={index}>
      {(provided) => (
        <ListItem
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          disablePadding
        >
          <ListItemButton>
            <Stack direction='row' justifyContent='space-between' flexGrow={1} spacing={2}>
              
              <Box>
                <Typography variant='body1'>{summoner.name}</Typography>
                <Typography variant='body2'>Champ pool: {summoner.filteredMasteries.length}</Typography>
                <IconButton onClick={() => deleteSummoner(summoner.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}  >
                {summoner.randomChamps.map((champId, index) => {
                  if(champId !== null) {
                    //const champ = getChampData(champId)
                    const champ = summoner.masteries.find((champ) => champ.championId === Number(champId))
                    return (
                      <Stack key={uuidv4()} alignItems='center' width={{ xs: 75, sm: 75}}>
                        <Box display={{ xs: 'none', md: 'block' }} component='img' sx={{ height: { xs: 75, sm: 75}, width: { xs: 75, sm: 75} }} alt={champ.name} src={`https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${champ.image.full}`} />
                        <Typography variant='caption' align='center'>{index+1}: {champ.name}</Typography>
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
                        <Box display={{ xs: 'none', md: 'flex' }} sx={{ height: 80, width: 80, bgcolor: 'black' }} alignItems='center' justifyContent='center'><Typography variant='h6' align='center' >?</Typography></Box>
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
