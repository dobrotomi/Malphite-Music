import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js"
import { distube } from "../../distube";
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the current music queue")
    .setDMPermission(false)
    
export const info: CommandInfo = {
    name: "stop",
    description: "Stops the current music queue",
    group: "Music"
}

export async function execute(interaction: CommandInteraction) {
    const queue = distube.getQueue(interaction.guild!)
    if( queue ) {
        distube.stop(interaction.guild!) 
        return await interaction.reply({content: ":white_check_mark: stop", ephemeral:true})
    } 
    return await interaction.reply({content: "no queue", ephemeral:true})
    
}