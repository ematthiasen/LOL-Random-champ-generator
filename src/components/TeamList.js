import { Box, Container, List, ListSubheader, Stack, Typography } from '@mui/material'
import Summoner from './Summoner'
import { Droppable } from 'react-beautiful-dnd'

const TeamList = ({teamList, summoners, getChampData}) => {

  return (

      <Droppable droppableId={teamList.id} >
        {(provided) => (
          <List
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ minWidth: 400, minHeight: 250 }}
          >
            <ListSubheader sx={{ bgcolor: 'inherit'}}>
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant='h6' sx={{ textTransform: 'uppercase'}}>
                  {teamList.id}
                </Typography>
                <Typography variant='subtitle1' sx={{ textTransform: 'uppercase'}}>
                  Random champs
                </Typography>
              </Stack>
            </ListSubheader>
            {teamList.summoners.map((summonerId, index) => {
              const summoner = summoners[summonerId]
              return (
                <Summoner
                  key={summoner.id}
                  summoner={summoner}
                  getChampData={getChampData}
                  index={index}
                >
      
                </Summoner>
              )
            })}
            {provided.placeholder}
          </List>
        )}
      </Droppable>

  )
}

export default TeamList