import { EmbedBuilder } from "discord.js";
import { Queue } from "distube";

export const data = {
  name: "empty",
  distube: true
}

export async function execute(queue: Queue) {
  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Disconnect")
    .setDescription(`The voice channel was empty.`)
  queue.textChannel?.send({embeds: [embed]})
}
