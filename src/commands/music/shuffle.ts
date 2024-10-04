import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js"
import { distube } from "../../distube";
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles the current music queue")
    .setDMPermission(false)
    
export const info: CommandInfo = {
    name: "shuffle",
    description: "Shuffles the current music queue",
    group: "Music"
}

export async function execute(interaction: CommandInteraction) {
    const queue = distube.getQueue(interaction.guild!)
    if( queue ) {
        queue.shuffle()
        return await interaction.reply({content: ":white_check_mark: shuffle", ephemeral:true})
    } 

    return await interaction.reply({content: "No queue", ephemeral:true})
    
    
}