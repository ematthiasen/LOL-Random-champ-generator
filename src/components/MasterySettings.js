import { useState } from "react"

const MasterySettings = () => {
  
  const [ minMasteryCutoff, setMinMasteryCutoff ] = useState(0)
  const [ maxMasteryCutoff, setMaxMasteryCutoff ] = useState(999999)



  const handleMinMasteryCutoff = (event) => {
    event.preventDefault()
    setMinMasteryCutoff(event.target.value)
    console.log(summonerStorageObject.summoners)
    // update filteredMasteries data for summoners

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
  }

  const handleMaxMasteryCutoff = (event) => {
    event.preventDefault()
    setMaxMasteryCutoff(event.target.value)
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
  }

  return (
    <div>
      Test mastery component
    </div>
  )


}

export default MasterySettings