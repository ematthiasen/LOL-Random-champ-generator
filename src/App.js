import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios'

function App() {

  const [ champList, setChampList ] = useState(null)
  const baseUrl = 'https://developer.riotgames.com/'


  useEffect(() => {
    fetch('http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json')
      .then((response) => response.json())
      .then(response => {
        setChampList(response.data)
      })
  
  }, [])


  console.log(champList)

  if (champList === null) return <div>Waiting</div>

  return (
    <div>
      {champList.map((champ) => 
        <li>{champ.id}</li>
      )}
    </div>
  )


}

export default App
