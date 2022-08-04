import { Divider, List, ListSubheader, Stack, Typography, Grid, Paper } from '@mui/material'
import Summoner from './Summoner'
import { Droppable } from 'react-beautiful-dnd'

const TeamList = ({teamList, summoners, getChampData, deleteSummoner}) => {

  return (

      <Droppable droppableId={teamList.id} >
        {(provided) => (
          <Grid item order={4} minWidth={{ xs: 200 }}>
            <Paper>
            <List 
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ minHeight: 250 }}
            >
              <ListSubheader sx={{ bgcolor: 'inherit'}}>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='h6' sx={{ textTransform: 'uppercase'}}>
                    {teamList.id}
                  </Typography>
                  <Typography variant='body2' sx={{ textTransform: 'uppercase'}} width={100}>
                    Random
                    champs
                  </Typography>
                </Stack>
              </ListSubheader>
              {teamList.summoners.map((summonerId, index) => {
                const summoner = summoners[summonerId]
                return (
                  <div key={summoner.id}>
                    <Divider />
                    <Summoner
                      summoner={summoner}
                      getChampData={getChampData}
                      index={index}
                      deleteSummoner={deleteSummoner}
                    />
                  </div>
                )
              })}
              {provided.placeholder}
            </List>
            </Paper>
          </Grid>
        )}
      </Droppable>

  )
}

export default TeamList