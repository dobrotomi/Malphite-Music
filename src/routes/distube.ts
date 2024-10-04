import express, { NextFunction, Request, Response } from 'express';
import { commands } from '../commands';
import { distube } from '../distube';
export const distubeR = express.Router()

distubeR.get('/skip/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    

});


