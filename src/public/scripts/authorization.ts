import express, { NextFunction, Request, Response } from 'express';
import { config } from '../../config';

export function isAuthorized(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        next()
    } else {
        res.redirect('/')
    }
}


export function isDiscordAuthorized(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    if (id === null) return res.redirect("/")
    if (!req.user) return res.redirect("/")
    if (!((req.user as User).id === config.OWNER_ID)) {
        if (!((req.user as User).guilds.some((guild: Guild) => (guild.id === id && (guild.owner || guild.permissions === 2147483647))))) {
            return res.redirect("/")
        }
    } else {
        return next()
    }
    next()
}

export function isOwner(req: Request, res: Response, next: NextFunction) {
    if(!req.user) return res.redirect("/")
    if((req.user as User) && (req.user as User).id === config.OWNER_ID) {
      next()
    } else {
      res.redirect("/")
    }
  }


interface User {
    id: string,
    guilds: Guild[];
}

interface Guild {
    id: string,
    owner: boolean,
    permissions: number;
}
