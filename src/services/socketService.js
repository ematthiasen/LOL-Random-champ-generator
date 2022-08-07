import { io } from 'socket.io-client'

const socketBaseUrl = 'http://localhost:3003'
const socket = io(socketBaseUrl)

const socketConnect = (setData, setSummonerLoading, setSnackbarList) => {
  socket.on('connect', () => console.log('socket id', socket.id))
  socket.on('connect_error', () => {
    setTimeout(() => socket.connect(), 5000)
  })
  socket.on('summoner-data', (data) => {
    console.log('received data object', data)
    setData(data)
    setSummonerLoading(false)
  })
  socket.on('error', (errorMessage) => {
    console.log('received error', errorMessage)
    setSummonerLoading(false)
    console.log(typeof setSnackbarList )
    //setSnackbarList((prev) => [...prev, { errorMessage, type: 'error' } ])

  })
  /*socket.on('time', (data) => {
    //console.log(data)
    setTime(data)
  })*/

  //socket.on('disconnect', () => setTime('server disconnected'))
  socket.on('disconnect', () => console.log('disconnected from socket server'))
}

const socketSendLoadSummoner = (summonerName) => {
  socket.emit('load-summoner', summonerName)
}

const modules = {
  socketConnect,
  socketSendLoadSummoner
}

export default modules