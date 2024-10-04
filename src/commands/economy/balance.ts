import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client, Embed, EmbedBuilder } from "discord.js"
import { ServerService } from "../../services/serverService";
import { User } from "../../models/serverUser"
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
  .setName("balance")
  .setDescription("Shows your balance in the RPG system")

export const info: CommandInfo = {
  name: "balance",
  description: "Shows your balance in the RPG system",
  group: "Economy"
}

export async function execute(interaction: CommandInteraction, client: Client) {
    const serverService = new ServerService()
    const user: User | undefined = await serverService.getUserById(interaction.user.id as string, interaction.guild?.id as string)
    if(user == undefined) {
      const user: User = new User(interaction.user.id, interaction.user.username)
      await serverService.addUser(user, interaction.guild?.id as string)
      return interaction.reply(`${user.balance}`)
    }
    
    const embed = new EmbedBuilder()
      .setTitle("Balance")
      .setDescription(`Your balance is ${user?.balance}$`)
      .setTimestamp()
    return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false}});
  }