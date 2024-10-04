import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { Logger } from "./utils/logger";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    Logger.log("Started refreshing application (/) commands.", "slash")
    commandsData.forEach(cmd => {
      
      Logger.log(`Loaded ${cmd.name} command`, "slash")
    })
    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_ID, guildId),
      {
        body: commandsData,
      }
    )
    Logger.log("Successfully reloaded application (/) commands.", "slash")
  } catch (error) {
    console.error(error);
    Logger.log(`${error}`, "error")
  }
}
