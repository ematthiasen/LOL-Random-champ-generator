import { createContext, useContext, useMemo, useState } from "react"

const SummonerContext = createContext()

const useSummonerContext = () => {
  const context = useContext(SummonerContext)
  if (!context) {
    throw new Error('useSummonerContext must be used inside a SummonerContextProvider')
  }

  const [ summoners, setSummoners ] = context

  const addSummoner = (summonerObject) => {
    summoners[summonerObject.id] = summonerObject
  }

  return [ summoners, setSummoners, addSummoner ]
}

const SummonerContextProvider = (props) => {
  const [ summoners, setSummoners ] = useState({})
  const value = useMemo(() => [ summoners, setSummoners ], [ summoners ])
  return <SummonerContext.Provider value={value} {...props} />
}

export { SummonerContextProvider, useSummonerContext}