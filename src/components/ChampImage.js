
import { Box, CircularProgress } from "@mui/material"
import { useState } from "react"

const ChampImage = ({ champ, size }) => {

  const [loaded, setLoaded ] = useState(false)

  const handleLoaded = () => {
    //console.log('done loading')
    setLoaded(true)
  }

  return (
    <>
      {!loaded &&
        <>
          <Box
            display={{ xs: 'none'}}
            component='img' 
            sx={{ height: size, width: size }} 
            alt={champ.name} 
            src={`https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${champ.image.full}`}
            onLoad={handleLoaded}
          />
          <Box display={{ xs: 'none', md: 'block' }} sx={{ height: size, width: size }} ><CircularProgress/></Box>
        </>
      }
      {loaded && 
        <Box
          display={{ xs: 'none', md: 'block' }}
          component='img' 
          sx={{ height: size, width: size }} 
          alt={champ.name} 
          src={`https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${champ.image.full}`}
        />
      }
    </>
  )
}

export default ChampImage