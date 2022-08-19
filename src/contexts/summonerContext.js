import { createContext, useContext, useMemo, useState } from "react"

const SummonerContext = createContext()

const useSummonerContext = () => {
  const context = useContext(SummonerContext)
  if (!context) {
    throw new Error('useSummonerContext must be used inside a SummonerContextProvider')
  }

  const [ summoners, setSummoners ] = context

  const addSummoner = (summonerObject) => {
    const newSummoners = {...summoners}
    newSummoners[summonerObject.id] = summonerObject
    setSummoners(newSummoners)
    return newSummoners
  }

  const rollSummoner = (summonerObject) => {
    
    try {
      const availableChamps = Array.from(summonerObject.filteredMasteries)
      const randomChampArray = [null, null, null]
      const rolledChamps = randomChampArray.map((slot, index) => {
        if(availableChamps.length > 0) {
          const champId = availableChamps[Math.floor(Math.random() * availableChamps.length)].championId
          //console.log('rolled', champId)
          //console.log('removing index', availableChamps.findIndex(e => e.championId === champId), 1)
          availableChamps.splice(availableChamps.findIndex(e => e.championId === champId), 1)
          return champId
        } else {
          return null
        }
      })
      console.log('rolled champs', rolledChamps)
      summonerObject.randomChamps = rolledChamps
      
      const newSummoners = {...summoners}
      newSummoners[summonerObject.id] = summonerObject
      setSummoners(newSummoners)
      return newSummoners

    } catch (error) {
      console.log('error occurred in rollSummoner function')
      throw error
    }
  }

  const deleteSummoner = (summonerId) => {
    console.log('deleting summoner', summonerId)
    const newSummoners = { ...summoners }
    console.log('new summoners before delete', newSummoners)
    delete newSummoners[summonerId]
    console.log('newSummoners after delete', newSummoners)
    setSummoners(newSummoners)
    console.log('summoners object set to ', newSummoners)
    return newSummoners
  }


  return [ summoners, setSummoners, addSummoner, rollSummoner, deleteSummoner ]
}

const SummonerContextProvider = (props) => {
  const [ summoners, setSummoners ] = useState({})
  const value = useMemo(() => [ summoners, setSummoners ], [ summoners ])
  return <SummonerContext.Provider value={value} {...props} />
}

export { SummonerContextProvider, useSummonerContext}