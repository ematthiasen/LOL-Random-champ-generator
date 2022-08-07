import { useEffect, useState } from 'react'

import socketService from '../services/socketService'

const SocketTest = () => {

  const [ time, setTime ] = useState('fetching time')
  const [ data, setData ] = useState({})

  useEffect(() => {
    socketService.socketConnect(setData, setTime)
  }, [])

  return (


    <div>{time}</div>
  )

}

export default SocketTest