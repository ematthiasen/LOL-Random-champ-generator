const getSummoner = async (summonerName) => {
  try {
    const result = await fetch(`/.netlify/functions/getSummoner?summonerName=${summonerName}`)
  
    if (result.status !== 200) {
      console.log('statuscode other than 200')
      return null
    }
    const resultJSON = await result.json()
    // add empty randomChamps array
    resultJSON.data.randomChamps = [null, null, null]

    return (resultJSON.data)
  } catch (error) {
    console.log('error', error)
    return null
  }
}

const populateSummonerMasteries = async (summonerObject, champList) => {

  try {
    const masteries = await getSummonerMasteries(summonerObject.id)
    if (masteries === null){
      console.log(`masteries for summoner ${summonerObject.name} not found`)
      const error = new Error()
      error.message(`masteries for summoner ${summonerObject.name} not found`)
      throw error
    }
    //populate masteries data with more champ information
    masteries.map(masteryChamp => {
      //find champ in champlist
      const currentChamp = champList.find(champ => Number(champ.key) === masteryChamp.championId)
      masteryChamp.name = currentChamp.name
      masteryChamp.image = currentChamp.image
      masteryChamp.tags = currentChamp.tags
      return null
    })
    summonerObject.masteries = masteries
    return summonerObject

  } catch(error) {
    console.log('error encountered in function populateSummoner')
    throw error
  }
  
}

const generateFilteredMasteries = (summonerObject, minMasteryCutoff, maxMasteryCutoff) => {
  try {
    console.log('summonerObject', summonerObject)
    const filteredMasteries = summonerObject.masteries.filter(champ => maxMasteryCutoff > champ.championPoints && champ.championPoints > minMasteryCutoff )
    summonerObject.filteredMasteries = filteredMasteries
    return summonerObject

  } catch (error) {
    console.log('encountered error in function generateFilteredMasteries')
    throw error
  }
}


const getSummonerMasteries = async (encryptedSummonerId) => {
  try {
    const result = await fetch(`/.netlify/functions/getSummonerMasteries?encryptedSummonerId=${encryptedSummonerId}`)
    if (result.status !== 200) {
      console.log('statuscode other than 200')
      return null
    }
    const resultJSON = await result.json()
    return (resultJSON.data)
  } catch (error) {
    console.log('error', error)
    return null
  }
}

const exports = {
  getSummoner,
  getSummonerMasteries,
  populateSummonerMasteries,
  generateFilteredMasteries
}

export default exports