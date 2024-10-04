import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder, GuildMember, GuildTextBasedChannel, VoiceChannel } from "discord.js"
import { distube } from "../../distube";
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays the music you want")
    .addStringOption(option =>
        option.setName("song")
            .setRequired(true)
            .setDescription("The songname/url, you want to play"))
    .setDMPermission(false)

export const info: CommandInfo = {
    name: "play",
    description: "Plays the music you want",
    group: "Music"
}

export async function execute(interaction: CommandInteraction) {
    let link = interaction.options.get("song", true)

    const voiceChannel: VoiceChannel = (interaction.member as GuildMember).voice.channel as VoiceChannel;
    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTimestamp()
        .setTitle("Play")
    distube.play(voiceChannel, link.value as string, {
        member: interaction.member as GuildMember,
        textChannel: interaction.channel as GuildTextBasedChannel
    }).catch(async err => {
        embed.setDescription(`${err.message} - <#${voiceChannel.id}>`)
        //return await interaction.reply({embeds: [embed]})
    })

    embed.setDescription(`:white_check_mark:`)
    interaction.reply({embeds: [embed], ephemeral:true})
    //interaction.replied ? interaction.editReply({embeds: [embed]}) : interaction.reply({embeds: [embed], ephemeral:true})
    
}