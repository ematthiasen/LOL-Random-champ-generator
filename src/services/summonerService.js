const getSummoner = async (summonerName) => {
  try {
    const result = await fetch(`/.netlify/functions/getSummoner?summonerName=${summonerName}`).then((res => res.json()))
    console.log(result)
    return (result.data)
  } catch (error) {
    console.log('error', error)
  }
}

const getSummonerMasteries = async (encryptedSummonerId) => {
  try {
    const result = await fetch(`/.netlify/functions/getSummonerMasteries?encryptedSummonerId=${encryptedSummonerId}`).then((res => res.json()))
    console.log(result)
    return (result.data)
  } catch (error) {
    console.log('error', error)
  }
}

const exports = { getSummoner, getSummonerMasteries }

export default exports