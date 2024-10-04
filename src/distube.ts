import { DisTube, DisTubePlugin } from "distube"
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify"
import { YouTubePlugin } from "@distube/youtube"
import { client } from "./bot";
import { config } from "./config";
import { readDistubeEvents } from "./utils/DistubeEventReader";
const fs = require("fs");

let plugins: DisTubePlugin[] = [
    new YouTubePlugin({
        cookies: JSON.parse(fs.readFileSync(__dirname + "/cookies.json"))
    }),
    new SoundCloudPlugin(),
    new SpotifyPlugin(),
]

export const distube = new DisTube(client, {
    nsfw: true,
    emitAddListWhenCreatingQueue: true,
    emitAddSongWhenCreatingQueue: false,
    emitNewSongOnly: true,
    joinNewVoiceChannel: false,
    plugins: plugins,

})
//youtubeCookie:  JSON.parse(fs.readFileSync(__dirname + "/cookies.json")),

/**
 *     ffmpeg: {
        path: "/usr/bin/ffmpeg"
    }
 */

readDistubeEvents(distube)