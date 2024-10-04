import { config } from "./config";

const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);



export async function deleteCommands(guildid: string) {
	// for guild-based commands
	rest.put(Routes.applicationGuildCommands(config.DISCORD_ID, guildid), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

	rest.put(Routes.applicationCommands(config.DISCORD_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);
}	
