import { Button, Card, CardContent, CardHeader, CardMedia, Stack, Typography, Avatar, Grid, ListItem, ListItemButton } from "@mui/material"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"



const SummonerSmall = ({summoner, getChampData, index}) => {
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

  return (
    <Draggable draggableId={summoner.id} index={index}>
      {(provided) => (
          <ListItem disablePadding
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <ListItemButton>
            {summoner.name}
          </ListItemButton>
        </ListItem>
      )}

    </Draggable>
  )
}

export default SummonerSmall
