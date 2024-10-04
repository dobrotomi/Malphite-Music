import { Events, Client, EmbedBuilder, Message, Emoji } from "discord.js"
import { config } from "../config"
import { Logger } from "../utils/logger"


export const data = {
  name: Events.MessageCreate,
  once: false
}

export async function execute(message: Message, client: Client) {
    if(message.member?.user.bot || message.author.bot || message.guild!.id != "680488209414750241") return
    if(message.content.toLowerCase() == "jo8") {
        return (await message.reply({ content: "JO8", allowedMentions: { repliedUser: false}})).react("🌙")
    }

    if(message.content.toLowerCase() == "bumm") {
        return (await message.reply({content: "BUMM", allowedMentions: { repliedUser: false}})).react("💥")
    }
    /*
    if(message.content.toLowerCase().includes("<@1051128491967533116>") && message.content.endsWith("?") && message.content.toLowerCase().includes("vagy")) {
        let reply = message.content.replace("<@1051128491967533116>", "").replace("?", "").split(" vagy ")
        //console.log(reply)
        return message.reply({ content: `${reply[Math.floor(Math.random()*reply.length)]}`, allowedMentions: { repliedUser: false}})
    }*/

    if (message.content.toLowerCase().includes("van") && message.content.toLowerCase().includes("<@1051128491967533116>") && message.content.endsWith("?")) {
        const reply = ["Van", "Nincs"]
        return message.reply({ content: `${reply[Math.floor(Math.random()*reply.length)]}`, allowedMentions: { repliedUser: false}})
    } else if(message.content.toLowerCase().includes("<@1051128491967533116>") && message.content.endsWith("?")) {
        const reply = ["Igen", "Nem"]
        return message.reply({ content: `${reply[Math.floor(Math.random()*reply.length)]}`, allowedMentions: { repliedUser: false}})
    }
    if(Math.random() <= 0.02) {
        return message.reply({content: "NEM", allowedMentions: { repliedUser: false }})
    }

    
}

