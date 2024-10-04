import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } from "discord.js"
import { commands } from "../index"
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Instructions for the bot");

export const info: CommandInfo = {
  name: "help",
  description: "Instructions for the bot",
  group: "Information"
}

export async function execute(interaction: CommandInteraction, client: Client) {
  const embed = new EmbedBuilder()
    .setTitle("Commands")
    .setTimestamp()
    .setColor(Colors.Blue)

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.com/oauth2/authorize?client_id=1051128491967533116&permissions=8&scope=bot+applications.commands")
        .setLabel("Invite")
      )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/2v4bpBFpdC")
        .setLabel("Support")
      )

  const commandsArray = Object.entries(commands).map(([key, value]) => ({key, value}))
  const groups = new Set()
  commandsArray.forEach(command => {
    groups.add(command.value.info.group)
  })
  let i = 0
  groups.forEach(group => {
    embed.addFields({name: `${group}`, value: `.`, inline: true})
    commandsArray.forEach(command => {
      if(command.value.info.group == group) {
        if(embed.data.fields![i].value == `.`) embed.data.fields![i].value = `- /${command.key} - ${command.value.info.description}\n`
        else embed.data.fields![i].value += `- /${command.key} - ${command.value.info.description}\n`
      }
    })
    i++;
  })
  interaction.reply({embeds: [embed], components: [row]})
}