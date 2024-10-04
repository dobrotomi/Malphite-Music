import { client } from "../bot"
import { commands } from "../commands";
import { Events, Interaction } from "discord.js"

export const data = {
  name: Events.InteractionCreate,
  once: false
}

export async function execute(interaction: Interaction) {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction, client);
  }
}
