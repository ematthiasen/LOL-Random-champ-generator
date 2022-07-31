import { Button, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material"
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
      <CardMedia
        component='img'
        height='80'
        image={`https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${mainChampData.image.full}`}
      />
      <CardContent>
      <Typography variant='h5'>
        {summoner.data.name}
      </Typography>
      <Typography variant='body1'>
        Champs owned: {summoner.masteries.length}
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
