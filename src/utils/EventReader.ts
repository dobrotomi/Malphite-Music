const fs = require("fs")
const path = require("path")
import { Client } from "discord.js"
import { Logger } from "../utils/logger"


export async function readEvents (client: Client) {
        
    const eventsPath = path.join(__dirname, '../events')
    const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.ts'));

    Logger.log(`Loading Discord Events`, "event");
    for (const file of eventFiles) {
        if(file != "index.ts") {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            Logger.log(`Loading Discord Event ${event.data.name}`, "event");
            if (event.data.once) {
                client.once(event.data.name, (...args) => event.execute(...args));
            } else {
                client.on(event.data.name, (...args) => event.execute(...args));
            }
        }
        
    }
    
}