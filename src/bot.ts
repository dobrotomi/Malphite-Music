import { Client, Colors, EmbedBuilder, WebhookClient } from "discord.js";
import { config } from "./config";
import { readEvents } from "./utils/EventReader"
import { Logger } from "./utils/logger"
import { app, webServer } from "./app";
import { distube } from "./distube";


export const client = new Client({
  intents: ["Guilds", "GuildMessages","GuildMembers", "MessageContent", "GuildMessageReactions", "GuildVoiceStates"],
});

export const webhookClient = new WebhookClient({url: "https://discord.com/api/webhooks/1280942700534693888/6OD-VnB_IlD_nEKJWzlYfvA9Oaf1JkRW-mRzV5fW3NyxPZTcrcHfLHMDwesj1aMTxRXQ"});


readEvents(client)



process.on('unhandledRejection', async error => {
  const user = await client.users.fetch(config.OWNER_ID as string)
  const embed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(`${error}`)
      .setTimestamp()
      .setColor(Colors.Red)
  user.send({ embeds: [embed] }).then(() => { }).catch((error) => {
    Logger.log(`${error}\nCan't send message to user`, "error")
  })
  Logger.log(`Unhandled promise rejection: ${error}`, "error")
  try {
    webhookClient.send({embeds: [embed]})
  } catch (error) {
    Logger.log(error as string, "error")
  }
});


process.on("uncaughtException", (err, origin) => {
  console.log("[antiCrash] :: Uncaught Exception/Catch");
  console.log(err?.stack, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log("[antiCrash] :: Uncaught Exception/Catch (MONITOR)");
  console.log(err?.stack, origin);
});



client.login(config.DISCORD_TOKEN);

