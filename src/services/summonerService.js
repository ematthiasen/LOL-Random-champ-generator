const getSummoner = async (summonerName) => {
  try {
    const result = await fetch(`/.netlify/functions/getSummoner?summonerName=${summonerName}`)
  
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

const exports = { getSummoner, getSummonerMasteries }

export default exports