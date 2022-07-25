import { Card, Paper, Grid, Typography, Stack, TextField, Button } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useEffect, useState } from 'react'
import championService from './services/championService'
import summonerService from './services/summonerService'
import Summoner from './components/Summoner'

function App() {
  const [ champList, setChampList ] = useState([])
  const [ summonerName, setSummonerName] = useState('')
  const [ summonerList, setSummonerList] = useState([])

  useEffect(() => {
    console.log('effect')
    championService.getChampions()
      .then(champArray => {
        console.log('setting champ List', champArray)
        setChampList(champArray)
      })

  }, [])

  if (champList === []) return <div>Waiting</div>
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  const handleLoadSummoner = async () => {
    console.log('starting load summoner call')
    const summonerData = await summonerService.getSummoner(summonerName)
    console.log('returned', summonerData)
    const masteries = await summonerService.getSummonerMasteries(summonerData.id)
    console.log(masteries)

    const newSummoner = {
      data: summonerData,
      masteries
    }
    //check if summoner is already in list, if so replace.

    setSummonerList(summonerList.concat(newSummoner))


  }

  const getChampionData = (championId) => {
    console.log('checking id', championId)
    const champ = champList.find((champ) => Number(champ.key) === championId)
    console.log('Champ', champ)
    return champ
  }


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <Grid container justifyContent='center'>
          <Paper variant='0'>
            <Stack direction='column' spacing={2}>
              <Typography variant='h5'>done waitinga asdfasdf asdfdf</Typography>
              <Card sx={{ p: 2 }}>
                <Stack direction='row'>
                  <TextField id='summoner-name' label='Summoner name' variant='outlined' value={summonerName} onChange={(event) => setSummonerName(event.target.value)} />
                  <Button id='load-summoner' onClick={handleLoadSummoner}>Load</Button>
                </Stack>
              </Card>
              
              
                {summonerList.map((summoner) => (
                  <Summoner key={summoner.data.id} summoner={summoner} getChampData={getChampionData} />
                ))}
              

            </Stack>
          </Paper>
        </Grid>
    </ThemeProvider>
  )


}

export default App
