const DISCORD_TOKEN = ""
const DISCORD_ID = ""
const DISCORD_CLIENT_SECRET = ""
const OWNER_ID = ""
const YOUTUBE_COOKIE = ""
const SPOTIFY_ID = ""
const SPOTIFY_SECRET = ""

const FIREBASE_CONFIG = {

  };

const IP = ""
const PORT = 8080

if(!DISCORD_TOKEN || !DISCORD_ID) {
    throw new Error("Missing envrioment variables (Discord token or ID)")
}

export const config = {
    DISCORD_TOKEN,
    DISCORD_ID,
    DISCORD_CLIENT_SECRET,
    FIREBASE_CONFIG,
    IP,
    OWNER_ID,
    YOUTUBE_COOKIE,
    SPOTIFY_ID,
    SPOTIFY_SECRET,
    PORT
}