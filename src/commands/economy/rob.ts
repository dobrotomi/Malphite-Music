//rablás másik embertől, 20% esély sikeres rablásra. Sikeres rablás esetén balance 10%-át lehet elrabolni. 1óra cooldown
//interaction listázza ki az embereket a szerveren

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client, Embed, EmbedBuilder } from "discord.js"
import { ServerService } from "../../services/serverService";
import { User } from "../../models/serverUser"
import { CommandInfo } from "../../models/commandInfo";

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
    const user: User | undefined = await serverService.getUserById(interaction.user.id as string, interaction.guild?.id as string)
    if(user == undefined) {
      const user: User = new User(interaction.user.id, interaction.user.username)
      await serverService.addUser(user, interaction.guild?.id as string)
      
    }

    const target: User | undefined = await serverService.getUserById(interaction.options.data[0].user!.id as string, interaction.guild?.id as string)
    if(target == undefined) {
        const target: User = new User(interaction.options.data[0].user!.id, interaction.options.data[0].user!.username)
        await serverService.addUser(target, interaction.guild?.id as string)
    }
    console.log(target)
    
    const embed = new EmbedBuilder()
      .setTitle("Balance")
      .setDescription(`Your balance is ${user?.balance}$`)
      .setTimestamp()
    return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false}});
  }