const axios = require('axios')
const baseUrl = 'https://euw1.api.riotgames.com'

const getSummoner = async (summonerName) => {

  console.log('summonerservice trying')
  try {
    console.log('api key', process.env.RIOT_API_KEY)

    const headerConfig = {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
     }
    }
    const response = await axios.get(`${baseUrl}/lol/summoner/v4/summoners/by-name/${summonerName}`, headerConfig)
    console.log(response.data)
    return response.data
  }
  catch (error) {
    //throw error
    console.log(error)
    throw error
  }
}

const getSummonerMasteries = async (encryptedSummonerId) => {

  try {
    const headerConfig = {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
     }
    }
    
    const response = await axios.get(`${baseUrl}/lol/champion-mastery/v4/champion-masteries/by-summoner/${encryptedSummonerId}`, headerConfig)
    return  response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  getSummoner,
  getSummonerMasteries
}