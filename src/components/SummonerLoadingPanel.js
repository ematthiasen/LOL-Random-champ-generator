import { Grid, TextField, Button, Stack } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useState } from 'react'
import summonerService from '../services/summonerService'
import { useSummonerContext } from '../contexts/summonerContext'
import { useTeamlistContext } from '../contexts/teamlistContext'
import { useSnackbarContext } from '../contexts/snackbarContext'

const SummonerLoadingPanel = ({ champList }) => {
  //Form input related
  const [ summonerName, setSummonerName] = useState('')
  const [ summonerLoading, setSummonerLoading ] = useState(false)

  const [ , setSummoners , addSummoner ] = useSummonerContext()
  const [ , setTeamlist , addSummonerToTeamlist ] = useTeamlistContext()

  const { displaySnackbarMessage } = useSnackbarContext()

  // make a context for the mastery cutoffs
  //placeholder data
  const minMasteryCutoff = 0
  const maxMasteryCutoff = 999999


  const handleLoadSummoner = async (event) => {
    event.preventDefault()
    //console.log('clicked handle load summoner')
    setSummonerLoading(true)
    try {
      let summonerData = await summonerService.getSummoner(summonerName)
      //populate with masteries
      summonerData = await summonerService.populateSummonerMasteries(summonerData, champList)
      // apply filter
      summonerData = summonerService.generateFilteredMasteries(summonerData, minMasteryCutoff, maxMasteryCutoff)

      const newTeamlist = addSummonerToTeamlist(summonerData)
      // Errors if summoner is already in a teamlist or roster is full
      const newSummoners = addSummoner(summonerData)
      setSummonerLoading(false)
      window.localStorage.setItem('AramSummonerStorageObject', JSON.stringify({ storedSummoners: newSummoners, storedTeamlist: newTeamlist }))
      displaySnackbarMessage(`Summoner ${summonerData.name} loaded`, 'success')
      setSummonerName('')
    } catch (error) {
      setSummonerLoading(false)
      displaySnackbarMessage(`Failed to load summoner ${summonerName}: ${error.message}`, 'error')
    }
  }

  const clearDataAndStorage = () => {
    //window.localStorage.removeItem('AramSummonerStorageObject')
    setSummoners({})
    setTeamlist({
      'team1': {
        id: 'team1',
        summoners: []
      },
      'team2': {
        id: 'team2',
        summoners: []
      }
    })
  }

  return(

    <Grid item flexShrink xs={12} md={6} order={{ xs: 2 }} >
      <form onSubmit={handleLoadSummoner}>
        <Stack direction='row' justifyContent='center' xs={8} >
          <TextField id='summoner-name' label='Summoner name' variant='outlined' value={summonerName} onChange={(event) => setSummonerName(event.target.value)} />
          <Button id='load-summoner' onClick={handleLoadSummoner} variant='outlined'>{summonerLoading ? <CircularProgress /> : 'Load'}</Button>
          <Button variant='outlined' onClick={clearDataAndStorage} sx={{ ml: 2}}>Clear data</Button>
        </Stack>
      </form>
    </Grid>

  )
}

export default SummonerLoadingPanel