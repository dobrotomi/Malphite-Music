import { EmbedBuilder } from "discord.js";
import { Queue } from "distube";
import { client } from "../../bot";

export const data = {
  name: "disconnect",
  distube: true
}

export async function execute(queue: Queue) {
  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Disconnect")
    .setDescription(`Left the voice channel.\nThank you for using ${client.user!.username}!`)
  queue.textChannel?.send({embeds: [embed]})
}
