import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js"
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export const info: CommandInfo = {
  name: "ping",
  description: "Replies with Pong!",
  group: "Information"
}

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Pong!");
}