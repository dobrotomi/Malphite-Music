const DISCORD_TOKEN = ""
const DISCORD_ID = ""
const DISCORD_CLIENT_SECRET = ""
const OWNER_ID = ""
const SPOTIFY_ID = ""
const SPOTIFY_SECRET = ""

const MONGO_DB = "mongodb://localhost:27017"

const IP = "localhost"
const PORT = 8080



if(!DISCORD_TOKEN || !DISCORD_ID || MONGO_DB) {
    throw new Error("Missing envrioment variables (Discord token or ID or DB)")
}

if(!IP || !PORT) {
    throw new Error("Missing envrioment variables (Website IP or port)")
}

if(!OWNER_ID) {
    throw new Error("Missing envrioment variables (Bot owner Discord ID)")
}

export const config = {
    DISCORD_TOKEN,
    DISCORD_ID,
    DISCORD_CLIENT_SECRET,
    IP,
    MONGO_DB,
    OWNER_ID,
    SPOTIFY_ID,
    SPOTIFY_SECRET,
    PORT
}