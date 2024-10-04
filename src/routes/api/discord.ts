import express, { NextFunction, Request, Response } from 'express';
import { isAuthorized, isDiscordAuthorized, isOwner } from '../../public/scripts/authorization';
import { client } from '../../bot';
import { distube } from '../../distube';
import { ChannelType, Collection, GuildMember } from 'discord.js';

export const discordR = express.Router()

discordR.get('/stats', (req: Request, res: Response) => {
    let userCount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let guildCount = client.guilds.cache.size;
  res.json({
    userCount: userCount,
    guildCount: guildCount
  })
});

discordR.get('/user', isAuthorized, (req: Request, res: Response) => {
    res.json(req.user)
});

discordR.get('/channels/:id', isAuthorized, (req: Request, res: Response) => {
  let guild = client.guilds.cache.get(req.params.id);
  let channels = guild?.channels.cache.filter(c => c.type == ChannelType.GuildVoice)
  let ret: any[] = []
  channels?.forEach(c => {
    let assign: any = {
      channel: c.name,
      users: []
    }
    if (c.members instanceof Collection) {
      if(c.members) {
        c.members.forEach((m: GuildMember) =>{
          if(m) {
            assign.users.push({
              name: m.displayName,
              id: m.id,
              picture: m.displayAvatarURL()
            })
          }
          
        })
      }
    }
    ret.push(assign)
  })

  res.json(ret)
});







