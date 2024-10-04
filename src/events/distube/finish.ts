import { EmbedBuilder } from "discord.js";
import { Queue } from "distube";

export const data = {
  name: "finish",
  distube: true
}

export async function execute(queue: Queue) {
  const embed = new EmbedBuilder()
    .setTitle("Queue")
    .setColor("Red")
    .setDescription("No more songs in the queue.")
  
    queue.textChannel?.send({embeds: [embed]})
}
