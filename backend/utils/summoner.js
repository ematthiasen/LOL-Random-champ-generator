const summonerService = require('../services/summonerService')

const loadSummoner = async (summonerName, champList, summonerStorageObject) => {
  console.log('started trying')
  try {
    const summonerData = await summonerService.getSummoner(summonerName)
    //console.log('received summoner Data')
    const masteries = await summonerService.getSummonerMasteries(summonerData.id)
    //console.log('received mastery Data')
    //console.log('champlist is', champList)
    //console.log(masteries[0])
    masteries.map(masteryChamp => {

      const currentChamp = champList.find(champ => {
        //console.log(champ)
        //console.log('compare', champ.key, masteryChamp.championId)
        return Number(champ.key) === masteryChamp.championId
      })
      //console.log('curretChamp', currentChamp)
      masteryChamp.name = currentChamp.name
      masteryChamp.image = currentChamp.image
      masteryChamp.tags = currentChamp.tags
      return null
    })
    console.log('processed mastery Data')
    const filteredMasteries = masteries.filter(champ => summonerStorageObject.masteryCutoff.max > champ.championPoints && champ.championPoints > summonerStorageObject.masteryCutoff.max )
    console.log(summonerStorageObject.masteryCutoff.min, summonerStorageObject.masteryCutoff.max)
    //console.log('champs before  filter', masteries.length)
    //console.log('champs after filter', filteredMasteries.length)

    const newSummoner = {
      ...summonerData,
      masteries,
      filteredMasteries,
      randomChamps: [null, null, null]
    }

    const updatedSummonerStorage = {
      ...summonerStorageObject,
    }

    if(summonerStorageObject.summoners.hasOwnProperty(newSummoner.id)) {
      console.log('already in summonerlist, checking if in list')
      let summonerInList = false
      for (const key of Object.keys(summonerStorageObject.lists)) {
        const returnValue = summonerStorageObject.lists[key].summoners.find(e => e === newSummoner.id)
        if(returnValue !== undefined) {
          summonerInList = true
          console.log(`summoner found in list: ${key}`)
        }
      }
      if(summonerInList) {
        console.log('summoner already in a list')
        //handle update of object
        //UPdate storage information, but do not add to list
        const error = new Error()
        error.message = 'Summoner is already on the roster'
        console.log('throwing error', error)
        throw error
      } else {
        // Add summoner to a list
        console.log('summoner not in a list, adding to an empty list slot')
      }
    }
    updatedSummonerStorage.summoners[newSummoner.id] = newSummoner

    if (updatedSummonerStorage.lists['team1'].summoners.length < 3){
      updatedSummonerStorage.lists['team1'].summoners.push(newSummoner.id)
    } else if (updatedSummonerStorage.lists['team2'].summoners.length < 3) {
      updatedSummonerStorage.lists['team2'].summoners.push(newSummoner.id)
    } else {
      // throw an error, no room in teams
      const error = new Error()
      error.message(`Roster is full, no room for ${newSummoner.name}. Make room and try again`)
      throw error
    }
    // need a setter function?
    return updatedSummonerStorage

  } catch (error) {
    console.log('error', error.message)
    throw error
  }
  
}



module.exports = {
  loadSummoner
}