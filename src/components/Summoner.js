import { Box, Card, CardContent, Typograhpy, CardMedia, Stack, Typography, Avatar, Grid, ListItem, ListItemButton } from "@mui/material"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import assassin from '../images/assassin.png'
import fighter from '../images/fighter.png'
import mage from '../images/mage.png'
import marksman from '../images/marksman.png'
import support from '../images/support.png'
import tank from '../images/tank.png'




const Summoner = ({summoner, getChampData, index}) => {
  //console.log('rendering Summoner', summoner)
  const [ randomChamp, setRandomChamp ] = useState(null)
  //console.log('randomchamp', randomChamp)
  //console.log('Summoner comp', summoner)
  //console.log('champ data', getChampData(summoner.masteries[0].championId).image.sprite)

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



  const mainChampData = getChampData(summoner.masteries[0].championId)

  const generateRandomChamp = () => {
    const randomNumber = Math.floor(Math.random() * summoner.masteries.length)
    setRandomChamp(summoner.masteries[randomNumber])

  }

/*
  <Avatar alt={summoner.name} src={`https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${mainChampData.image.full}`} />
*/



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
            <Stack direction='row' justifyContent='space-between' flexGrow={1}>
              
              <Box sx={{ pl: 1 }}>
                <Typography variant='body1'>{summoner.name}</Typography>
                <Typography variant='body2'>Champ pool: {summoner.masteries.length}</Typography>
              </Box>
              <Stack direction='row' spacing={1} >
                {summoner.randomChamps.map((champId, index) => {
                  if(champId !== 0) {
                    const champ = getChampData(champId)
                    return (
                      <Stack alignItems='center' width={80}>
                        <Box component='img' sx={{ height: 80, width: 80 }} alt={champ.name} src={`https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${champ.image.full}`} />
                        <Typography variant='body2' align='center'>{index+1}: {champ.name}</Typography>
                        <Stack direction='row' justifyContent='center'>
                          {champ.tags.map((tag) => (
                            <Box component='img' sx={{ height: 20, width: 20 }} alt={roleTypes[tag].tooltip} src={roleTypes[tag].image} />
                          ))}
                          </Stack>
                      </Stack>
                      
                    )
                  } else {
                    return (
                      <div>empty</div>
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
