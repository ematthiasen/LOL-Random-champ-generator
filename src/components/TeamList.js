import { Box } from '@mui/material'
import Summoner from './Summoner'
import { Droppable } from 'react-beautiful-dnd'

const TeamList = ({teamList, summoners, getChampData}) => {



  return (
    <Box sx={{ px: 1, py: 1 }}>
      <Droppable droppableId={teamList.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
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
          </div>
        )}
      </Droppable>
    </Box>
  )
}

export default TeamList