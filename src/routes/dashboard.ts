import express, { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import { client } from '../bot';
import { ServerService } from '../services/serverService';
import { isAuthorized, isDiscordAuthorized } from '../public/scripts/authorization';
export const dashboard = express.Router()

dashboard.get('/', isAuthorized, async (req: Request, res: Response) => {
      const guilds = client.guilds.cache.map(guild => guild.id);
      //console.log(guilds.includes("680488209414750241"))
    res.render("dashboard", {
      user: req.user,
      botid: config.DISCORD_ID,
      guilds: guilds
    })
});

dashboard.get('/:id', isDiscordAuthorized, async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;


  const serverService = new ServerService()
  let server = await serverService.getServerById(id)

  let users = server!.users;
  let sortedSmokers: [any, any][] = []
  let sortedBalance: [any, any][] = []
  if(users) {
    sortedSmokers = [...users.entries()].sort((a, b) => b[1].cigi - a[1].cigi)
    sortedBalance = [...users.entries()].sort((a, b) => b[1].balance - a[1].balance)
  }


  let guild = await client.guilds.fetch(id)
  let roles = guild.roles.cache.map(role => {
    return role
  })
  //console.log(roles)
  
  
  res.render("guild_profile", {
    user: req.user,
    server: server,
    smokers: sortedSmokers,
    balance: sortedBalance,
    roles: roles
  })  
})










