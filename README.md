# Malphite Music is a Rock Solid bot for Discord


## Before you start, make sure you have the following:
 - `Node` 
 - `npm install`
 - `/orarend` folder, might work without it
 - `config.json` for youtube cookies
 - `MongoDB`
 - `src/config.ts`

### In the `config.ts` you have to provide the following:
  - `DISCORD_TOKEN` you can get this from discord deverloper portal
  - `DISCORD_ID` you can get this from discord deverloper portal
  - `DISCORD_CLIENT_SECRET` you can get this from discord deverloper portal
  - `OWNER_ID` copy it from discord
  - `SPOTIFY_ID` you can get this from spotify developer page
  - `SPOTIFY_SECRET` you can get this from spotify developer page
  - `` you can get this from the Firebase console
  - `IP` for the website 
  - `PORT` where you want to run the webapp
  - `MONGO_DB` for database

## TODO:
- BOT:
  - Delete the embed after a few seconds when you add  a song to the queue
  - Music is not working now!
  - save playlist?
- WEBSITE:
  - bot owner tab
      - tudja állítani a kiírást a bothoz client.idk ami a ready eventben is van
      - Warningot tudjon hozzáadni a websitehoz, amit megkapjanak az emberek is az info channelbe dc-n 1x és törlésig, x-percenként kapják meg a weboldalon is warningba
      - reload page, tudja reloadolni a commandokat ha valamit változtatok rajta
      - commandok kikapcsolása/bekapcoslása
  - Login után akinek van órarend hozzáadva tudja megnézni.
  
  - Játékok a weboldalon, blackjack, slot, roulette
  - Log tab, ahol látszódik, hogy hova joinolt a bot, honnan lépett ki, mikor, esetleg melyik commandot mikor használták (sok db resource)
  
  - Az is lássa a szervert akinek van DJ-roleja ha be van kapcsolva a szerveren a DJ Only. Aki ezzel a role-al nézi meg a szervert, az csak a Zenével kapcsolatos dolgoat tudja majd állítani.
  - oldalról jöjjön elő a navbar telefonon is és gépen is
  - Saved playlists befejezés
  - DJ role befejezés
  