import { Box, Card, CardContent, Typograhpy, CardMedia, Stack, Typography, Avatar, Grid, ListItem, ListItemButton } from "@mui/material"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"



const Summoner = ({summoner, getChampData, index}) => {
  //console.log('rendering Summoner', summoner)
  const [ randomChamp, setRandomChamp ] = useState(null)
  //console.log('randomchamp', randomChamp)
  //console.log('Summoner comp', summoner)
  //console.log('champ data', getChampData(summoner.masteries[0].championId).image.sprite)

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
            <Box sx={{ alignContent: 'end' }}>
              Random champs:
              {summoner.randomChamps.map(champId => {
                if(champId !== 0) {
                  const champ = getChampData(champId)
                  return (
                    <div>{champ.name}</div>
                  )
                } else {
                  return (
                    <div>empty</div>
                  )
                }




              })}
            </Box>
            </Stack>
          </ListItemButton>
        </ListItem>
      )}

    </Draggable>
  )
}

export default Summoner
