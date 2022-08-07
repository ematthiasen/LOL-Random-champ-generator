import axios from 'axios'

const baseUrl = 'http://localhost:3002'


const getSummoner = async (summonerName) => {
  try {
    const result = await axios.get(`${baseUrl}/summoners/${summonerName}`)
  
    console.log('result.data', result.data)
    //const resultJSON = await result.json()
    //return (resultJSON.data)
    return result.data
  } catch (error) {
    console.log('error', error)
    return null
  }
}

const getSummonerMasteries = async (encryptedSummonerId) => {
  try {
    const result = await axios.get(`${baseUrl}/summoners/masteries/${encryptedSummonerId}`)
    console.log('result dta', result.data)
    //const resultJSON = await result.json()
    //return (resultJSON.data)
    return result.data
  } catch (error) {
    console.log('error', error)
    return null
  }
}

const exports = { getSummoner, getSummonerMasteries }

export default exports