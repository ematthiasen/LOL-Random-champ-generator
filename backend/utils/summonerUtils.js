const summonerService = require('../services/summonerService')

const loadSummoner = async (summonerName, champList, summonerStorageObject) => {
  console.log('started trying')
  try {
    const summonerData = await summonerService.getSummoner(summonerName)
    const masteries = await summonerService.getSummonerMasteries(summonerData.id)

    masteries.map(masteryChamp => {

      const currentChamp = champList.find(champ => {
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
    //console.log('masteries length', masteries.length)
    const filteredMasteries = masteries.filter(champ => summonerStorageObject.masteryCutoff.max > champ.championPoints && champ.championPoints > summonerStorageObject.masteryCutoff.min )
    //console.log('filtered masteries length', filteredMasteries.length)
    //console.log(summonerStorageObject.masteryCutoff.min, summonerStorageObject.masteryCutoff.max)
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

const deleteSummoner = async (summonerId, dataObject) => {
  try {
    const newSummonerList = {
      ...dataObject.summoners
    }
    delete newSummonerList[summonerId]
    
    const newStorageObject = {
      ...dataObject,
      summoners: newSummonerList,
      lists: {
        ...dataObject.lists,
      }
    }

    for (const list of Object.values(dataObject.lists)){
      const index = list.summoners.findIndex((summoner) => summoner === summonerId)
      if (index !== -1){
        console.log('hit in list', list.id, 'on index', index)

        const newList = Array.from(list.summoners)
        newList.splice(index, 1)
        console.log('newlist', newList)
        console.log('oldlist', list.summoners)
        newStorageObject.lists[list.id].summoners = newList
      }
    }
    return newStorageObject

  } catch (error) {
    console.log('error',error.message )
    throw error
  }
}

const editLists = async (newLists, dataObject) => {
  //console.log(newLists)
  const newStorageObject = {
    ...dataObject,
    lists: {
      ...newLists,
    }
  }
  return newStorageObject
}

const rollSummoner = async (summonerId, dataObject) => {
  const randomChamps = rollSingleSummoner(summonerId, dataObject)
  console.log('received rolled champs', randomChamps)

  const updatedSummonerStorage = {
    ...dataObject,
  }
  updatedSummonerStorage.summoners[summonerId].randomChamps = randomChamps
  return updatedSummonerStorage
}

const rollTeam = async (listId, dataObject) => {
  const updatedSummonerStorage = {
    ...dataObject,
  }
  dataObject.lists[listId].summoners.map((summonerId) => {
    const rolledChamps = rollSingleSummoner(summonerId, dataObject)
    //TODO: implement criteria for valid rolls.
    //for example, if preference for fighter, mage or tank is set, check that the champ fulfill the criteria
    // or if a minimum of mastery level is allowed
    updatedSummonerStorage.summoners[summonerId].randomChamps = rolledChamps
  })
  return updatedSummonerStorage
}

const rollSingleSummoner = (summonerId, dataObject) => {
  const currentSummoner = dataObject.summoners[summonerId]
  const availableChamps = Array.from(currentSummoner.filteredMasteries)
  const randomChampArray = [null, null, null]
  const rolledChamps = randomChampArray.map((slot, index) => {
    //console.log('index', index)
    //console.log('available champs', availableChamps.length)
    if(availableChamps.length > 0) {
      const champId = availableChamps[Math.floor(Math.random() * availableChamps.length)].championId
      //console.log('rolled', champId)
      //console.log('removind index', availableChamps.findIndex(e => e.championId === champId), 1)
      availableChamps.splice(availableChamps.findIndex(e => e.championId === champId), 1)
      return champId
    } else {
      return null
    }
  })
  return rolledChamps
}

const updateMasteryCutoffs = async (dataObject) => {
  const updatedSummonerStorage = {
    ...dataObject
  }
  for (const [key, summoner] of Object.entries(dataObject.summoners)) {
    const newFilteredMasteries = summoner.masteries.filter(champ => dataObject.masteryCutoff.max > champ.championPoints && champ.championPoints > dataObject.masteryCutoff.min )
    console.log('summoner', summoner.name)
    updatedSummonerStorage.summoners[key].filteredMasteries = newFilteredMasteries
  }

  return updatedSummonerStorage
}


module.exports = {
  loadSummoner,
  deleteSummoner,
  editLists,
  rollSummoner,
  rollTeam,
  updateMasteryCutoffs
}