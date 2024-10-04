import express, { NextFunction, Request, Response } from 'express';
import { commands } from '../../commands';
import { distube } from '../../distube';
import { isDiscordAuthorized } from '../../public/scripts/authorization';
export const distubeR = express.Router()

distubeR.get('/previous/:id', isDiscordAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if(distube.getQueue(id)) distube.previous(id)
    res.status(204).end()
    
});

distubeR.get('/stop/:id', isDiscordAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if(distube.getQueue(id)) distube.stop(id)
    res.status(204).end()
});

distubeR.get('/play/:id', isDiscordAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if(distube.getQueue(id)) {
        if(distube.getQueue(id)?.paused) distube.resume(id)
        else distube.pause(id)
    }
    res.status(204).end()
    
});

distubeR.get('/shuffle/:id', isDiscordAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if(distube.getQueue(id)) distube.shuffle(id)
    res.status(204).end()
});

distubeR.get('/skip/:id', isDiscordAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if(distube.getQueue(id)) distube.skip(id)
    res.status(204).end()
    
});

distubeR.get('/:id/queue', isDiscordAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
  
    const queue = distube.getQueue(id)
    
    if (!queue) {
      res.json({ error: 'Queue is empty' });
      return;
    }
    
    const songs = queue.songs.map((song) => ({
      id: song.id,
      name: song.name,
      url: song.url,
      duration: song.duration,
      formattedDuration: song.formattedDuration,
      currentTime: queue.currentTime,
      formattedCurrentTime: queue.formattedCurrentTime,
      thumbnail: song.thumbnail
    }));
    
    res.json(songs)
  })