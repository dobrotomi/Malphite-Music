import express, { NextFunction, Request, Response, Errback } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import session = require('express-session');
import passport = require('passport')
import { config } from './config';
import { dashboard } from "./routes/dashboard";
import { auth } from './routes/auth';
import { owner } from './routes/owner';
import { Logger } from './utils/logger';
import { client } from './bot';
import { command } from './routes/command';
import { discordR } from './routes/api/discord';
import { distubeR } from './routes/api/distube';


dotenv.config();

export const app = express();





app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "x",
    cookie: {
        maxAge: 60000*60*24
    },
    saveUninitialized: false,
    resave: true,
    name: "discord.oauth2"
}))




/* Passport ------------------------------------------------------------ */

var DiscordStrategy = require('passport-discord').Strategy;

var scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.use(new DiscordStrategy({
    clientID: config.DISCORD_ID,
    clientSecret: config.DISCORD_CLIENT_SECRET,
    callbackURL: 'http://'+config.IP+':'+config.PORT+'/auth/callback',
    scope: scopes
},
function(accessToken: any, refreshToken: any, profile: any, done: any) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj!);
});

app.use(passport.initialize())
app.use(passport.session())

/* Routes -------------------------------------------------------------- */



app.use("/dashboard", dashboard)

app.use("/auth", auth)

app.use("/owner", owner)

app.use("/commands", command)

app.use("/api/discord", discordR)

app.use("/api/distube", distubeR)

app.get('/', function(req, res) {
    res.render("index", {
        user: req.user,
        botid: config.DISCORD_ID
    })
});

app.get('/forbidden', (req, res) => {
    res.render('forbidden', {
        user: req.user
      });
});





export function webServer(): Promise<{ port: number }> {
    const port = config.PORT as number;
    return new Promise((resolve, reject) => {
      app.listen(port, () => {
        resolve({ port });
      }).on('error', (err: string) => {
        reject(err);
      });
    });
  }





