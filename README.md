Branch socket-version:

Use socket.io so that all players see the same picks and bans

App running on: https://aramrandom.netlify.app/

A simple app that generates random champions for League of Legends, when playing custom games with friends

The app uses the RIOT api to get information about "summoners" (the player accounts) and which champions the player has accumulated mastery points for.

In order to try to balance teams, the app can filter out champions that summoners have a low or high mastery score on.

The App uses "react-beautiful-dnd" so that summoners can be dragged and dropped between teams 1 and 2.
On larger screens, champion portraits and role icons are diplayed for each random champion