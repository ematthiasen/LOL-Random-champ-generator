import { Box, List, ListItem, ListSubheader } from '@mui/material'
import SummonerSmall from './SummonerSmall'
import { Droppable } from 'react-beautiful-dnd'

const BenchList = ({teamList, summoners, getChampData, drawerWidth}) => {

  return (
      <Droppable droppableId={teamList.id} direction='vertical'>
        {(provided) => (
          <Box sx={{ width: 1, height: 1 }}>
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ height: 1, minWidth: { xs: 200 } }}
            >
              <ListSubheader>
                Bench
              </ListSubheader>
              {teamList.summoners.map((summonerId, index) => {
                const summoner = summoners[summonerId]
                return (
                  <SummonerSmall
                    key={summoner.id}
                    summoner={summoner}
                    getChampData={getChampData}
                    index={index}
                  />
                )
              })}
              {provided.placeholder}
            </List>
          </Box>
        )}
      </Droppable>

  )
}

export default BenchList