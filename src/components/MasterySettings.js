import { Grid, TextField } from "@mui/material"
import { useMasteryContext } from "../contexts/masteryContext"
import { useSummonerContext } from "../contexts/summonerContext"
import { useTeamlistContext } from "../contexts/teamlistContext"
import summonerService from '../services/summonerService'

const MasterySettings = () => {
  
  const [ masteryCutoff, setMasteryCutoff,  ] = useMasteryContext()
  const [ teamlist ] = useTeamlistContext()
  const [ summoners, setSummoners ] = useSummonerContext()

  const handleMinMasteryCutoff = (event) => {
    event.preventDefault()
    setMasteryCutoff({ ...masteryCutoff, min: Number(event.target.value)})

    const newSummoners = { ...summoners}
    // for each summoner in team1's summonerlist
    for (const listId of Object.keys(teamlist)) {
      teamlist[listId].summoners.map((summonerId) => {
        // generate new filtered summoners list
        newSummoners[summonerId] = summonerService.generateFilteredMasteries(summoners[summonerId], Number(event.target.value), masteryCutoff.max)
        return null
      })
    }
    setSummoners(newSummoners)
  }

  const handleMaxMasteryCutoff = (event) => {
    event.preventDefault()
    setMasteryCutoff({ ...masteryCutoff, max: Number(event.target.value)})

    const newSummoners = { ...summoners}
    // for each summoner in team1's summonerlist
    for (const listId of Object.keys(teamlist)) {
      teamlist[listId].summoners.map((summonerId) => {
        // generate new filtered summoners list
        newSummoners[summonerId] = summonerService.generateFilteredMasteries(summoners[summonerId], masteryCutoff.min, Number(event.target.value))
        return null
      })
    }
    setSummoners(newSummoners)
  }

  return (
    <Grid item order={{ xs: 4 }} xs={12}>
      <TextField size='small' id='mastery-minimum-point-cutoff' type='number' label='Minimum mastery points' variant='outlined' value={masteryCutoff.min} onChange={handleMinMasteryCutoff} />
      <TextField size='small' id='mastery-maximum-point-cutoff' type='number' label='Maximum mastery points' variant='outlined' value={masteryCutoff.max} onChange={handleMaxMasteryCutoff} />
    </Grid>
  )


}

export default MasterySettings