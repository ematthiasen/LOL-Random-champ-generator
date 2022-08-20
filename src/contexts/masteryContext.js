import { createContext, useContext, useState } from "react"


const initialState = {
  min: 0,
  max: 999999
}

const saveMasteryToLocalStorage = (masteryData) => {
  window.localStorage.setItem('AramRandomMasteryObject', JSON.stringify(masteryData))
}

const loadMasteryFromLocalStorage = () => {
  const savedMasteryObject = window.localStorage.getItem('AramRandomMasteryObject')
  if(savedMasteryObject) {
    //console.log('found stored Mastery Object', savedMasteryObject)
    const savedMasteryData = JSON.parse(savedMasteryObject)
    initialState.min = savedMasteryData.min
    initialState.max = savedMasteryData.max
  }
}

loadMasteryFromLocalStorage()

const MasteryContext = createContext(initialState)

const useMasteryContext = () => {
  const context = useContext(MasteryContext)
  if (!context) {
    throw new Error('useMasteryContext must be used inside a MasteryContextProvider')
  }
  return context
}

const MasteryContextProvider = (props) => {

  const [ masteryCutoff, setMasteryCutoff ] = useState(initialState)
  // include saving mastery to local storage in the function
  const setMasteryAndStoreLocal = (masteryData) => {
    setMasteryCutoff(masteryData)
    saveMasteryToLocalStorage(masteryData)
  }


  const value = [ masteryCutoff, setMasteryAndStoreLocal]
  //console.log('mastery cutoff', masteryCutoff)
  return <MasteryContext.Provider value={value} {...props} />
}

export { useMasteryContext, MasteryContextProvider }