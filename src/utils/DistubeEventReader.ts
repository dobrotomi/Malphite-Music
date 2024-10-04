const fs = require("fs")
const path = require("path")
import { client } from "../bot"
import { Logger } from "../utils/logger"
import DisTube from "distube"


export async function readDistubeEvents (distube: DisTube) {
        
    const eventsPath = path.join(__dirname, '../events/distube')
    const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.ts'));

    Logger.log(`Loading Distube Events`, "distube");
    for (const file of eventFiles) {
        if(file != "index.ts") {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            //console.log(event)
            if(event.data.distube) {
                Logger.log(`Loading Distube Event ${event.data.name}`, "distube");
                distube.on(event.data.name, (...args: any) => event.execute(...args))
            }
        }    
    }
}