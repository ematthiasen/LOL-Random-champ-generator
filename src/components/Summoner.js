import { Button, Card, CardContent, CardHeader, CardMedia, Stack, Typography, Avatar } from "@mui/material"
import { useState } from "react"
//import { useState } from "react"


const Summoner = ({summoner, getChampData}) => {
  console.log('rendering Summoner', summoner)
  const [ randomChamp, setRandomChamp ] = useState(null)
  console.log('randomchamp', randomChamp)
  //const [summonerMasteries, setSummonerMasteries] = useState([])
  console.log('Summoner comp', summoner)
  console.log('champ data', getChampData(summoner.masteries[0].championId).image.sprite)

  const mainChampData = getChampData(summoner.masteries[0].championId)

  const generateRandomChamp = () => {
    const randomNumber = Math.floor(Math.random() * summoner.masteries.length)
    setRandomChamp(summoner.masteries[randomNumber])

  }

  return (
    <Card key={summoner.data.id} variant='outlined'>
      <CardHeader
        avatar={
          <Avatar alt={summoner.data.name} src={`https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${mainChampData.image.full}`} />
        }
        title={summoner.data.name}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
      <Typography variant='body1'>
        Champions with mastery: {summoner.masteries.length}
      </Typography>
      <Stack>
        <Button onClick={generateRandomChamp}>Random champ</Button>
        {randomChamp ? 
          <>Random champ: {getChampData(randomChamp.championId).name} </>:
          <></>
        }
      </Stack>
      </CardContent>

    </Card>
  )
}

export default Summoner
