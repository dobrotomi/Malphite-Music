import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js"
import { distube } from "../../distube";
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Turns on automatic music playing")
    .setDMPermission(false)
    
export const info: CommandInfo = {
    name: "autoplay",
    description: "Turns on automatic music playing",
    group: "Music"
}

export async function execute(interaction: CommandInteraction) {
    const queue = distube.getQueue(interaction.guild!)
    distube.toggleAutoplay(interaction.guild!)
    return await interaction.reply({content: ":white_check_mark: autoplay" + queue?.autoplay as string, ephemeral:true})
    
    
}