import { io } from 'socket.io-client'

const socketBaseUrl = '/'
const socket = io(socketBaseUrl)

const socketConnect = (setData, setSummonerLoading, displaySnackbarMessage, setMinMasteryCutoff, setMaxMasteryCutoff) => {
  socket.on('connect', () => console.log('socket id', socket.id))
  socket.on('connect_error', () => {
    setTimeout(() => socket.connect(), 5000)
  })
  socket.on('summoner-data', (data) => {
    console.log('received data object', data)
    setMinMasteryCutoff(data.masteryCutoff.min)
    setMaxMasteryCutoff(data.masteryCutoff.max)
    setData(data)
    setSummonerLoading(false)
  })
  socket.on('snackbar-error', (errorMessage) => {
    console.log('received error', errorMessage)
    setSummonerLoading(false)
    displaySnackbarMessage(errorMessage, 'error')
  })
  /*socket.on('updated-mastery-cutoff', (masteryCutoff) => {
    console.log('new mastery cutoff')
    setMinMasteryCutoff(masteryCutoff.min)
    setMinMasteryCutoff(masteryCutoff.max)

  })
  */
  socket.on('snackbar-success', (message) => {
    console.log('received success notification', message)
    setSummonerLoading(false)
    displaySnackbarMessage(message, 'success')

  })
  /*socket.on('time', (data) => {
    //console.log(data)
    setTime(data)
  })*/

  //socket.on('disconnect', () => setTime('server disconnected'))
  socket.on('disconnect', () => console.log('disconnected from socket server'))
}

const sendLoadSummoner = (summonerName) => {
  socket.emit('load-summoner', summonerName)
}

const sendDeleteSummoner = (summonerId) => {
  socket.emit('delete-summoner', summonerId)
}

const sendUpdatedLists = (updatedLists) => {
  console.log('updatedLists', updatedLists)  
  socket.emit('edit-lists', updatedLists)

}

const sendRollSummoner = (summonerId) => {
  console.log('request roll for summoner', summonerId)  
  socket.emit('roll-summoner', summonerId)
}

const sendRollTeam = (listId) => {
  console.log('request roll for team', listId)
  socket.emit('roll-team', listId)
}

const sendMinMasteryCutoff = (minMasteryCutoff) => {
  socket.emit('min-mastery-cutoff', minMasteryCutoff)
}

const sendMaxMasteryCutoff = (maxMasteryCutoff) => {
  socket.emit('max-mastery-cutoff', maxMasteryCutoff)
}

const modules = {
  socketConnect,
  sendLoadSummoner,
  sendDeleteSummoner,
  sendUpdatedLists,
  sendRollSummoner,
  sendRollTeam,
  sendMinMasteryCutoff,
  sendMaxMasteryCutoff
}

export default modules