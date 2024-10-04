import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js"
import { distube } from "../../distube";
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Disconnects the bot from the voice channel")
    .setDMPermission(false)
    
export const info: CommandInfo = {
    name: "leave",
    description: "Disconnects the bot from the voice channel",
    group: "Music"
}

export async function execute(interaction: CommandInteraction) {
    const queue = distube.getQueue(interaction.guild!)
    if( queue ) {
        distube.stop(interaction.guild!) 
    } 
    distube.voices.leave(interaction.guild!)
    
    interaction.reply({content: ":white_check_mark: leave", ephemeral:true})
}