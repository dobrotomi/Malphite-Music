import express, { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import { client } from '../bot';
import { ServerService } from '../services/serverService';
import { isOwner } from '../public/scripts/authorization';
export const owner = express.Router()

owner.get('/', isOwner, async (req: Request, res: Response) => {
    const guilds = client.guilds.cache.map(guild => guild);
    //console.log(guilds)
    
  res.render("owner", {
    user: req.user,
    botid: config.DISCORD_ID,
    guilds: guilds
  })
});


