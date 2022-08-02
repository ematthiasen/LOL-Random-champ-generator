import { ListItem, ListItemButton } from "@mui/material"
import { Draggable } from "react-beautiful-dnd"



const SummonerSmall = ({summoner, index}) => {

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
