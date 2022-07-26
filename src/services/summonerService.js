import axios from 'axios'
import env from 'react-dotenv'

//const baseUrl = 'https://developer.riotgames.com/'
const baseUrl = 'https://aramrandomcors.herokuapp.com/https://euw1.api.riotgames.com'

const getSummoner = async (summonerName) => {
  const headerConfig = {
    headers: {
      'X-Riot-Token': env.RIOT_API_KEY
   }
  }
  const result = await axios.get(`${baseUrl}/lol/summoner/v4/summoners/by-name/${summonerName}`, headerConfig)
  console.log(result.data)
  return(result.data)
}

const getSummonerMasteries = async (encryptedSummonerId) => {
  const headerConfig = {
    headers: {
      'X-Riot-Token': env.RIOT_API_KEY
   }
  }

  const result = await axios.get(`${baseUrl}/lol/champion-mastery/v4/champion-masteries/by-summoner/${encryptedSummonerId}`, headerConfig)
  console.log(result.data)
  return(result.data)

}

const exports = { getSummoner, getSummonerMasteries }

export default exports