import { EmbedBuilder } from "discord.js";
import { Playlist, Queue } from "distube";

export const data = {
  name: "addList",
  distube: true
}

export async function execute(queue: Queue, playlist: Playlist) {
  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Added to Queue")
    .setDescription(`${playlist.name}`)
    .addFields({name: `Requested by`, value: `${playlist.user?.tag}`, inline: true},
                {name: `Duration`, value: `\`[${playlist.formattedDuration}]\``, inline: true},
                {name: `Queue`, value: `\`[${queue.formattedDuration}]\``, inline: true})
    .setTimestamp()
    queue.textChannel?.send({embeds: [embed]})

    /*
  .then(msg => {
      if(msg) setInterval(function() { return msg.delete() }, 60000)
    })
    */
}
