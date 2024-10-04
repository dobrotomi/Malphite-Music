import { EmbedBuilder } from "discord.js";
import { Queue, Song } from "distube";

export const data = {
  name: "addSong",
  distube: true
}

export async function execute(queue: Queue, song: Song) {
  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Added to Queue")
    .setDescription(`${song.name}`)
    .addFields({name: `Requested by`, value: `${song.user?.tag}`, inline: true},
                {name: `Duration`, value: `\`[${song.formattedDuration}]\``, inline: true},
                {name: `Queue`, value: `\`[${queue.formattedDuration}]\``, inline: true})
    .setTimestamp()
    .setThumbnail(song.thumbnail!)
    queue.textChannel?.send({embeds: [embed]})
}
