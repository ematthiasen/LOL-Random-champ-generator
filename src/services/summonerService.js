import axios from 'axios'
import env from 'react-dotenv'

const corsProxyUrl = env.LOCAL_CORS || 'https://aramrandomcors.herokuapp.com'
const baseUrl = 'https://euw1.api.riotgames.com'

console.log(corsProxyUrl)

const getSummoner = async (summonerName) => {
  const headerConfig = {
    headers: {
      'X-Riot-Token': env.RIOT_API_KEY
   }
  }
  console.log('full address:', `${corsProxyUrl}/${baseUrl}/lol/summoner/v4/summoners/by-name/${summonerName}`)
  const result = await axios.get(`${corsProxyUrl}/${baseUrl}/lol/summoner/v4/summoners/by-name/${summonerName}`, headerConfig)
  console.log(result.data)
  return(result.data)
}

const getSummonerMasteries = async (encryptedSummonerId) => {
  const headerConfig = {
    headers: {
      'X-Riot-Token': env.RIOT_API_KEY
   }
  }

  const result = await axios.get(`${corsProxyUrl}/${baseUrl}/lol/champion-mastery/v4/champion-masteries/by-summoner/${encryptedSummonerId}`, headerConfig)
  console.log(result.data)
  return(result.data)

}

const exports = { getSummoner, getSummonerMasteries }

export default exports