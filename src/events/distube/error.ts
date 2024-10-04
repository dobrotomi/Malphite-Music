import { Channel, EmbedBuilder } from "discord.js";
import { client, webhookClient } from "../../bot";
import { config } from "../../config";
import { Logger } from "../../utils/logger";

export const data = {
  name: "error",
  distube: true
}

export async function execute(channel: Channel, error: Error) {
  const user = await client.users.fetch(config.OWNER_ID as string)
  const embed = new EmbedBuilder()
    .setColor("DarkRed")
    .setTitle("Distube Error")
    .setDescription(`\`\`\`${error.name}\n${error.message}\`\`\`\n${channel.url}`)
    .setTimestamp()
  user.send({embeds: [embed]})
  //console.log(error)
  try {
    webhookClient.send({embeds: [embed]})
  } catch (error) {
    Logger.log(error as string, "error")
  }
  
}
