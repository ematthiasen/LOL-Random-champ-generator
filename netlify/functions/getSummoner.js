const axios = require('axios')

exports.handler = async function (event, context) {

  const baseUrl = 'https://euw1.api.riotgames.com'

  try {
    const { summonerName } = event.queryStringParameters
    const headerConfig = {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
     }
    }
    const response = await axios.get(`${baseUrl}/lol/summoner/v4/summoners/by-name/${summonerName}`, headerConfig)
    return {
      statusCode: 200,
      body: JSON.stringify({ data: response.data })
    }
  } catch (error) {
    //throw error
    return {
      statusCode: error.response.status,
      body: error.toString()
    }
  }
}