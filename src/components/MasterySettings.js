import { Grid, TextField } from "@mui/material"
import { useState } from "react"

const MasterySettings = () => {
  
  const [ minMasteryCutoff, setMinMasteryCutoff ] = useState(0)
  const [ maxMasteryCutoff, setMaxMasteryCutoff ] = useState(999999)



  const handleMinMasteryCutoff = (event) => {
    event.preventDefault()
    setMinMasteryCutoff(event.target.value)

    // Changing the mastery cutoffs affects the available champions for each summoner. 
    // List of available champs need to be generated again for all summoners
    // Handle this in the summonerContext?

    // update filteredMasteries data for summoners
    // Move to a separate function?
    /*

    const updatedSummonerStorage = {
      ...summonerStorageObject
    }

    for (const [key, summoner] of Object.entries(summonerStorageObject.summoners)) {
      const newFilteredMasteries = summoner.masteries.filter(champ => maxMasteryCutoff > champ.championPoints && champ.championPoints > event.target.value )
      console.log('summoner', summoner.name)
      updatedSummonerStorage.summoners[key].filteredMasteries = newFilteredMasteries
    }

    storeLocalData(updatedSummonerStorage)
    setSummonerStorageObject(
      updatedSummonerStorage
    )

    */

  }

  const handleMaxMasteryCutoff = (event) => {
    event.preventDefault()


    setMaxMasteryCutoff(event.target.value)
    /*
    console.log(summonerStorageObject.summoners)
    // update filteredMasteries data for summoners

    const updatedSummonerStorage = {
      ...summonerStorageObject
    }

    for (const [key, summoner] of Object.entries(summonerStorageObject.summoners)) {
      const newFilteredMasteries = summoner.masteries.filter(champ => event.target.value > champ.championPoints && champ.championPoints > minMasteryCutoff )
      console.log('summoner', summoner.name)
      updatedSummonerStorage.summoners[key].filteredMasteries = newFilteredMasteries
    }

    storeLocalData(updatedSummonerStorage)
    setSummonerStorageObject(
      updatedSummonerStorage
    )
    */
  }

  return (
    <Grid item order={{ xs: 4 }} xs={12}>
      <TextField size='small' id='mastery-minimum-point-cutoff' type='number' label='Minimum mastery points' variant='outlined' value={minMasteryCutoff} onChange={handleMinMasteryCutoff} />
      <TextField size='small' id='mastery-maximum-point-cutoff' type='number' label='Maximum mastery points' variant='outlined' value={maxMasteryCutoff} onChange={handleMaxMasteryCutoff} />
    </Grid>
  )


}

export default MasterySettings