require('dotenv').config()
const express = require('express')

const socketIo = require('socket.io')
const http = require('http')
const cors = require('cors')
const summonerService = require('./services/summonerService')
const championService = require('./services/championService')

const summonerUtils = require('./utils/summoner')
const app = express()
app.use(cors())
const server = http.createServer(app)


app.use(express.json())


let champList = []

championService.getChampions()
  .then(champArray => {
    champList = champArray
    console.log('Updated champion list')
  })

setInterval(() => {
  championService.getChampions()
    .then(champArray => {
      champList = champArray
      console.log('Updated champion list')
    })
}, 100000)

let data = {
  summoners: {
  },
  lists: {

    'team1': {
      id: 'team1',
      summoners: []
    },
    'team2': {
      id: 'team2',
      summoners: []
    }
  },
  listOrder: ['team1', 'team2'],
  masteryCutoff: {
    min: 0,
    max: 999999
  }
}

const io = socketIo(server, {
  // Needed - check for server deployment
  cors: {
    origin: 'http://localhost:3000'
  }
  
})

io.on('connection', (socket) => {
  console.log('client connected', socket.id)

  socket.join('summoner-room')
  io.to('summoner-room').emit('summoner-data', data)

  socket.on('load-summoner', (summonerName) => {
    console.log('load-summoner called, received', summonerName)
      summonerUtils.loadSummoner(summonerName, champList, data)
        .then(updatedData => {
          data = updatedData
          io.to('summoner-room').emit('summoner-data', data)
        })
        .catch(error => {
          console.log('error received')
          io.to('summoner-room').emit('error', 'Unable to load summoner')
        })
  })

  socket.on('disconnect', (reason) => {
    console.log('disconnect', reason)
  })
})

setInterval(() => {
  io.to('summoner-room').emit('time', new Date())
}, 1000)



app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/summoners', async (request, response) => {
  /* Testing */
  console.log('request params', request.params)
  const summonerName = request.params.summonerName
  const summonerData = await summonerService.getSummoner(summonerName)
  const summonerMasteries = await summonerService.getSummonerMasteries('mCX3pdDDEqYgFXbZ6T8pA_rAJzm0H-lLtp4ZGe_BdEUamK8')
  console.log(summonerMasteries)
  response.json(summonerData)
})

app.get('/summoners/:summonerName', async (request, response) => {
  /* Testing */
  console.log('request params', request.params)
  const summonerName = request.params.summonerName
  const summonerData = await summonerService.getSummoner(summonerName)
  //const summonerMasteries = await summonerService.getSummonerMasteries('mCX3pdDDEqYgFXbZ6T8pA_rAJzm0H-lLtp4ZGe_BdEUamK8')
  //console.log(summonerMasteries)
  response.json(summonerData)
})

app.get('/summoners/masteries/:encryptedSummonerId', async (request, response) => {
  /* Testing */
  console.log('request params', request.params)
  const encryptedSummonerId = request.params.encryptedSummonerId
  const masteryData = await summonerService.getSummonerMasteries(encryptedSummonerId)
  //const summonerMasteries = await summonerService.getSummonerMasteries('mCX3pdDDEqYgFXbZ6T8pA_rAJzm0H-lLtp4ZGe_BdEUamK8')
  //console.log(summonerMasteries)
  response.json(masteryData)
})

app.post('/summoners', (request, response) => {
  /* Testing */
  console.log('worked?')
  console.log(request.body)
  data.summoners = request.body
  response.status(200)
  response.send() 
})



const PORT = process.env.PORT || 9999
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const SOCKET_PORT = process.env.SOCKET_PORT || 7777
server.listen(SOCKET_PORT, (err) => {
  console.log(`Socket.io server running on port ${SOCKET_PORT}`)
})