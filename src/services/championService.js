const getChampions = async () => {
  //console.log('started getting champions')
  const listOfChamps = []
  const response = await fetch('https://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json')
  const responseJson = await response.json()
  //console.log('received response', responseJson)
  Object.values(responseJson.data).forEach(val => {
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

const exports = { getChampions }

export default exports