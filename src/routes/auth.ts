import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { isAuthorized } from '../public/scripts/authorization';

export const auth = express.Router()


auth.get('/', passport.authenticate('discord'))
auth.get('/callback', 
    passport.authenticate('discord', { failureRedirect: "/forbidden" }), function(req, res) { res.redirect('/') } // auth success
)
auth.get('/logout', isAuthorized, (req: Request, res: Response, next: NextFunction) => {
    if(req.user) {
      req.logout
      req.session.destroy(function (err) {
        if(err) {
          return next(err)
        }
        req.session = null!
      })
    } 
    res.redirect("/")
})

auth.get('/forbidden', (req: Request, res: Response, next: NextFunction) => {
  
  res.render("forbidden", {
    user: req.user
  })
})






