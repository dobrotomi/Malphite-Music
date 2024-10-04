import { Events, Guild } from "discord.js"
import { deployCommands } from "../deploy-commands";
import { ServerService } from "../services/serverService";
import { config } from "../config"
import { EmbedBuilder } from "@discordjs/builders";
import { client } from "../bot";
import { Server, ServerImpl } from "../models/server";

export const data = {
  name: Events.GuildCreate,
  once: false
}

export async function execute(guild: Guild) {
  if(guild.id == "680488209414750241") {
    await deployCommands({ guildId: guild.id });
  } else {
    await deployCommands({ guildId: guild.id });
  }


  const serverService = new ServerService()
  const server = new ServerImpl(guild.id, guild.name)
  
  await serverService.createServer(server)
  .then(async () => {
    const embed = new EmbedBuilder()
      .setColor(0x7CFC00)
      .setTitle("Joined")
      .setDescription("Successfully joined to new server and created database")
      .addFields({name: `${guild.name}`, value: `${guild.joinedAt}`})
      .setTimestamp()

      const user = await client.users.fetch(config.OWNER_ID as string)
      user.send({embeds: [embed]})
  })
  
}

