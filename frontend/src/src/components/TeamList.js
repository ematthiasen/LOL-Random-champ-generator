import { Divider, List, ListSubheader, Stack, Typography, Grid, Paper } from '@mui/material'
import Summoner from './Summoner'
import { Droppable } from 'react-beautiful-dnd'

const TeamList = ({teamList, summoners, getChampData, deleteSummoner, handleRollSummoner}) => {

  return (

      <Droppable droppableId={teamList.id} >
        {(provided) => (
          <Grid item order={4} minWidth={{ xs: 165, md: 385 }} maxWidth={{ xs: 165, md: 385, lg: 'none' }}>
            <Paper>
            <List 
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ minHeight: {xs: 200, md: 200 } }}
              
            >
              <ListSubheader sx={{ bgcolor: 'inherit', px: { xs: 1, md: 2} }}>
                <Stack direction='row' justifyContent='space-between' spacing={1} alignItems='flex-start'>
                  <Typography variant='body1' sx={{ textTransform: 'uppercase'}}>
                    {teamList.id}
                  </Typography>
                  <Typography variant='body2' display={{ xs: 'none', md: 'block' }} sx={{ textTransform: 'uppercase'}}>
                    Random champs
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
                      handleRollSummoner={handleRollSummoner}
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