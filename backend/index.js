require('dotenv').config()
const express = require('express')

const socketIo = require('socket.io')
const http = require('http')
const cors = require('cors')
const summonerService = require('./services/summonerService')
const championService = require('./services/championService')

const summonerUtils = require('./utils/summonerUtils')
const app = express()
app.use(cors())
const server = http.createServer(app)

app.use(express.json())
app.use(express.static('build'))
//app.use('/static', express.static(path.join(__dirname, 'build//static')))

app.get('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, 'build/')})
})

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
        io.to('summoner-room').emit('snackbar-success', `added summoner ${summonerName}`)
      })
      .catch(error => {
        console.log('error received', error.message)
        io.to('summoner-room').emit('snackbar-error', error.message)
      })
  })

  socket.on('delete-summoner', (summonerId) => {
    console.log('delete summoner called, received', summonerId)
    summonerUtils.deleteSummoner(summonerId, data)
      .then(updatedData => {
        data = updatedData
        io.to('summoner-room').emit('summoner-data', data)
        io.to('summoner-room').emit('snackbar-success', `deleted summoner`)
      })
      .catch(error => {
        console.log('error received', error.message)
        io.to('summoner-room').emit('snackbar-error', error.message)
      })
  })

  socket.on('roll-summoner', (summonerId) => {
    console.log('roll summoner, received ', summonerId)
    summonerUtils.rollSummoner(summonerId, data)
      .then(updatedData => {
        data = updatedData
        io.to('summoner-room').emit('summoner-data', data)
      })
      .catch(error => {
        console.log('error received', error.message)
        io.to('summoner-room').emit('snackbar-error', error.message)
      })
  })

  socket.on('roll-team', (listId) => {
    console.log('roll team, received ', listId)
    summonerUtils.rollTeam(listId, data)
      .then(updatedData => {
        data = updatedData
        io.to('summoner-room').emit('summoner-data', data)
      })
      .catch(error => {
        console.log('error received', error.message)
        io.to('summoner-room').emit('snackbar-error', error.message)
      })
  })

  socket.on('edit-lists', ({updatedLists}) => {
    console.log('edit lists called, received', updatedLists)
    summonerUtils.editLists(updatedLists, data)
      .then(updatedData => {
        data = updatedData
        io.to('summoner-room').emit('summoner-data', data)
      })
  } )

  socket.on('max-mastery-cutoff', (maxMasteryCutoff) => {
    console.log('starting max mastery cutoff')
    data.masteryCutoff.max = maxMasteryCutoff
    summonerUtils.updateMasteryCutoffs(data)
      .then(updatedData => {
        data = updatedData
        io.to('summoner-room').emit('summoner-data', data)
      })
    //io.to('summoner-room').emit('updated-mastery-cutoff', data.masteryCutoff)
  })

  socket.on('min-mastery-cutoff', (minMasteryCutoff) => {
    data.masteryCutoff.min = minMasteryCutoff
    summonerUtils.updateMasteryCutoffs(data)
      .then(updatedData => {
        data = updatedData
        io.to('summoner-room').emit('summoner-data', data)
      })
    //io.to('summoner-room').emit('updated-mastery-cutoff', data.masteryCutoff)
  })

  socket.on('disconnect', (reason) => {
    console.log('disconnect', reason)
  })
})



app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

const PORT = process.env.PORT || 9999
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const SOCKET_PORT = process.env.SOCKET_PORT || 7777
server.listen(SOCKET_PORT, (err) => {
  console.log(`Socket.io server running on port ${SOCKET_PORT}`)
})