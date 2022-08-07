const axios = require('axios')

const getChampions = async () => {
  //console.log('started getting champions')
  const listOfChamps = []
  const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json')
  //console.log('champ list', Object.keys(response.data).length)

  //console.log(response.data.data)
  
  //const responseJson = await response.json()
  //console.log('received response', responseJson)
  Object.values(response.data.data).forEach(val => {
        //champList = champList.concat([val])
        //console.log(val)
    listOfChamps.push(val)
  })
  //console.log('champList', listOfChamps)
  return listOfChamps
  /*return [
    { id: 'Ahri', key: 1},
    { id: 'Ashe', key: 2}
  ]*/

}

module.exports = {
  getChampions
}