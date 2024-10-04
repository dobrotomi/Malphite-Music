import express, { NextFunction, Request, Response } from 'express';
import { commands } from '../commands';
export const command = express.Router()

command.get('/', async (req: Request, res: Response) => {
  
  let commandsArray = Object.values(commands).map(cmd => cmd.info);
  commandsArray.sort((a, b) => a.group.localeCompare(b.group));
  let groups: Set<string> = new Set<string>(commandsArray.map(cmd => cmd.group))
  //console.log(commandsArray)
    
  res.render("commands", {
    user: req.user,
    groups: groups,
    commands: commandsArray
  })
});


