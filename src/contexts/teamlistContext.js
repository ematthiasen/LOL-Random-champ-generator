import { createContext, useContext, useState, useMemo } from "react"


const TeamlistContext = createContext()

const useTeamlistContext = () => {
  const context = useContext(TeamlistContext)
  if (!context) {
    throw new Error('useTeamlistContext must be used inside a TeamlistContextProvider')
  }
  const [ teamlist, setTeamlist ] = context

  const addSummonerToTeamlist = (summonerObject) => {

    let summonerInList = false
    for (const key of Object.keys(teamlist)) {
      const returnValue = teamlist[key].summoners.find(e => e === summonerObject.id)
      if(returnValue !== undefined) {
        summonerInList = true
        console.log(`summoner found in list: ${key}`)
      }

    }
    if(summonerInList) {
      const error = new Error(`summoner ${summonerObject.name} is already in a list`)
      console.log(`summoner ${summonerObject.name} is already in a list`)
      //error.message(`summoner ${summonerObject.name} is already in a list`)
      throw error
    }
    const updatedTeamlist = { ...teamlist }
    if (teamlist['team1'].summoners.length < 3){
      updatedTeamlist['team1'].summoners.push(summonerObject.id)
    } else if (teamlist['team2'].summoners.length < 3) {
      updatedTeamlist['team2'].summoners.push(summonerObject.id)
    } else {
      const error = new Error(`Roster is full, no room for ${summonerObject.name}. Make room and try again`)
      //error.message()
      throw error
    }
    setTeamlist(updatedTeamlist)
    return updatedTeamlist
  }

  const deleteSummonerFromTeamlist = (summonerId) => {
    console.log('deleting summoner from teamlist', summonerId)
    // make a copy of teamlist
    const newTeamlist = {}
    console.log('old teamlist', teamlist)
  
    for (const [key, list] of Object.entries(teamlist)){
      console.log('key', key, 'list', list)
      newTeamlist[key] = { ...list }
      newTeamlist[key].summoners = [ ...list.summoners ]
      //console.log('new teamlist', newTeamlist[key])
      const index = newTeamlist[key].summoners.findIndex((summoner) => summoner === summonerId)
      if (index !== -1){
        console.log('hit in list', key, 'on index', index)

        //const newList = Array.from(newTeamlist[key].summoners)
        newTeamlist[key].summoners.splice(index, 1)
        console.log('newlist', newTeamlist[key].summoners)
        console.log('oldlist', list.summoners)
        //newTeamlist[list.id].summoners = newList
      }
    }
    setTeamlist(newTeamlist)
    return newTeamlist
  }


  return [ teamlist, setTeamlist, addSummonerToTeamlist, deleteSummonerFromTeamlist ]

}

const TeamlistContextProvider = (props) => {
  const [ teamlist, setTeamlist] = useState({
    'team1': {
      id: 'team1',
      summoners: []
    },
    'team2': {
      id: 'team2',
      summoners: []
    }
  })
  const value = useMemo(() => [teamlist, setTeamlist], [teamlist])
  return (<TeamlistContext.Provider value={value} {...props} />)

}

export { TeamlistContextProvider, useTeamlistContext }