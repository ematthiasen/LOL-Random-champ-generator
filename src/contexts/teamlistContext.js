import { createContext, useContext, useState, useMemo } from "react"


const TeamlistContext = createContext()

const useTeamlistContext = () => {
  const context = useContext(TeamlistContext)
  if (!context) {
    throw new Error('useTeamlistContext must be used inside a TeamlistContextProvider')
  }
  return context
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
  return (<TeamlistContext value={value} {...props} />)

}

export { TeamlistContextProvider, useTeamlistContext }