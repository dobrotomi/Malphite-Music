import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js"
import { distube } from "../../distube";
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song")
    .setDMPermission(false)
export const info: CommandInfo = {
    name: "skip",
    description: "Skips the current song",
    group: "Music"
}

export async function execute(interaction: CommandInteraction) {
    const queue = distube.getQueue(interaction.guild!)

    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Skip")
        
    if( !queue ) {
        embed.setDescription(`There is no music playing!`);
        return interaction.reply({embeds: [embed], ephemeral: true})
    }
    distube.skip(interaction.guild!).then(() => {
        
        embed.setDescription(`Successfully skipped [${queue.songs[0].name}](${queue.songs[0].url})`);
        return interaction.reply({embeds: [embed], ephemeral: true})
    }).catch((error) => {
        if (error.code === "NO_UP_NEXT") {
            distube.stop(interaction.guild!)
            embed.setDescription(`No more songs in the queue`);
            return interaction.reply({embeds: [embed], ephemeral: true})
        }
        embed.setDescription(`An error occurred while skip the song.`);
        return interaction.reply({embeds: [embed], ephemeral: true})
    })
}