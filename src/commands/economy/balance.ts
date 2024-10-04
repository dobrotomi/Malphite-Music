import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client, Embed, EmbedBuilder } from "discord.js"
import { ServerService } from "../../services/serverService";
import { User, UserImpl } from "../../models/user"
import { CommandInfo } from "../../models/commandInfo";
import { Server, ServerImpl } from "../../models/server";

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
    let server: ServerImpl | undefined = await serverService.getServerById(interaction.guild?.id!)

    if(server === undefined) {
      server = new ServerImpl(interaction.guild?.id!, interaction.guild?.name!)
      await serverService.createServer(server)
    }

    server = new ServerImpl(server.id, server.name, server.joinedAt, server.djrole, server.volume, server.users);

    let user = server.getUser(interaction.user.id)
    if(user === undefined) {
      user = new UserImpl(interaction.user.id, interaction.user.username)
      await server.addUser(user)
      return interaction.reply(`${user.balance}`)
    }
    
    const embed = new EmbedBuilder()
      .setTitle("Balance")
      .setDescription(`Your balance is ${user?.balance}$`)
      .setTimestamp()
    return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
    
  }

  /**
   * 
   * let user = await serverService.getUserById(interaction.guild?.id!, interaction.user.id)
    if(user === undefined) {
      user = new UserImpl(interaction.user.id, interaction.user.username)
      await serverService.addUser(user, interaction.guild?.id!)
      return interaction.reply(`${user.balance}`)
    }
   */