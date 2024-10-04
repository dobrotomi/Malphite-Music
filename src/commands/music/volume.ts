import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js"
import { distube } from "../../distube";
import { ServerService } from "../../services/serverService";
import { Server } from "../../models/server";
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change the volume of the queue")
    .addIntegerOption(option =>
        option.setName("volume")
                .setDescription("Number between 0 and 100")
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(100)
        )
        .setDMPermission(false)

export const info: CommandInfo = {
    name: "volume",
    description: "Change the volume of the queue",
    group: "Music"
}

export async function execute(interaction: CommandInteraction) {
    const queue = distube.getQueue(interaction.guild!)

    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Volume")
        
    if( !queue ) {
        embed.setDescription(`There is no music playing!`);
        return interaction.reply({embeds: [embed], ephemeral: true})
    }

    let volume = interaction.options.get("volume")?.value

    const serverService = new ServerService()
    let data: Server | undefined = await serverService.getServerById(interaction.guild?.id as string)

    if (data != undefined) {
        data.volume = volume as number;
        await serverService.updateServerById(interaction.guild?.id as string, data)
    }


    distube.setVolume(interaction.guild!, volume as number)
    
    embed.setDescription(`Changed the volume to ${volume}%`);
    return interaction.reply({embeds: [embed], ephemeral: true})

}