//rablás másik embertől, 20% esély sikeres rablásra. Sikeres rablás esetén balance 10%-át lehet elrabolni. 1óra cooldown
//interaction listázza ki az embereket a szerveren

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client, Embed, EmbedBuilder } from "discord.js"
import { ServerService } from "../../services/serverService";
import { User, UserImpl } from "../../models/user"
import { CommandInfo } from "../../models/commandInfo";
import { ServerImpl } from "../../models/server";

export const data = new SlashCommandBuilder()
  .setName("rob")
  .setDescription("Rob the user.")
  .addUserOption(option => option.setName("user").setDescription("The user you want to rob.").setRequired(true))

export const info: CommandInfo = {
  name: "rob",
  description: "Rob the user.",
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

    
    const user = server.getUser(interaction.user.id)

    if(user == undefined) {
      const user: User = new UserImpl(interaction.user.id, interaction.user.username)
      await server.addUser(user)
    }

    const target = server.getUser(interaction.options.data[0].user!.id)
    if(target == undefined) {
        const target: User = new UserImpl(interaction.options.data[0].user!.id, interaction.options.data[0].user!.username)
        await server.addUser(target)
    }
    console.log(target)
    
    const embed = new EmbedBuilder()
      .setTitle("Balance")
      .setDescription(`Your balance is ${user?.balance}$`)
      .setTimestamp()
    return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false}});
  }