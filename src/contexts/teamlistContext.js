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
      const error = new Error()
      error.message(`summoner ${summonerObject.name} is already in a list`)
      throw error
    }
    const updatedTeamlist = { ...teamlist }
    if (teamlist['team1'].summoners.length < 3){
      updatedTeamlist['team1'].summoners.push(summonerObject.id)
    } else if (teamlist['team2'].summoners.length < 3) {
      updatedTeamlist['team2'].summoners.push(summonerObject.id)
    } else {
      const error = new Error()
      error.message(`Roster is full, no room for ${summonerObject.name}. Make room and try again`)
    }
    setTeamlist(updatedTeamlist)  
  }


  return [ teamlist, setTeamlist, addSummonerToTeamlist ]

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