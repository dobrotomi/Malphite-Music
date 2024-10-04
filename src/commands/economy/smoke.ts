import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client, EmbedBuilder, Colors } from "discord.js"
import { ServerService } from "../../services/serverService";
import { User } from "../../models/serverUser"
import { Server } from "../../models/server";
import { CommandCooldown, msToMinutes } from "discord-command-cooldown";
import ms from "ms";
import { CommandInfo } from "../../models/commandInfo";

export const data = new SlashCommandBuilder()
  .setName("smoke")
  .setDescription("Smoke a cigarette with 50% for 20$")
  .addSubcommand(sub => sub.setName("cigarette").setDescription("Smoke a cigarette with 50% for 20$"))
  .addSubcommand(sub => sub.setName("leaderboard").setDescription("Shows the leaderboard of the smokers."))
  
export const info: CommandInfo = {
name: "smoke",
description: "Smoke a cigarette with 50% for 20$",
group: "Economy"
}

export async function execute(interaction: CommandInteraction, client: Client) {
    const serverService = new ServerService()
    //console.log(interaction.options.data)
    let embed = new EmbedBuilder()
    if(interaction.options.data[0].name == "leaderboard"){
            embed
                .setTitle("Leaderboard 🚬")
                .setTimestamp()
                .setColor(Colors.Orange)
        let data: Server | undefined = await serverService.getServerById(interaction.guild?.id as string)
        
        if(data != undefined) {
            let smokers = data.users;
            let sorted = [...smokers.entries()].sort((a, b) => b[1].cigi - a[1].cigi)
            //console.log(sorted)
            let i = 1;
            sorted.forEach(a => {
                if(embed.data.description == undefined) {
                    embed.setDescription(`**${i}**. ${a[1].name} - \`${a[1].cigi}\`\n`)
                } else {
                    embed.setDescription(embed.data.description + `**${i}**. ${a[1].name} - \`${a[1].cigi}\`\n`)
                }
                i++;
            })
            return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false}})
        } else {
            embed.setDescription("Leaderboard currently unavaliable")
            return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false}})
        }
    }

    if(interaction.options.data[0].name == "cigarette") {
        
        const smokeCd = new CommandCooldown("smoke", ms("5m"))
        const userOnCd = await smokeCd.getUser(interaction.user.id)
            embed
                .setTitle("Smoke 🚬")
                .setColor(Colors.Orange)
                .setTimestamp()
        if(userOnCd) {
            const timeLeft = msToMinutes(userOnCd.msLeft, false)
            embed.setDescription(`You need to wait ${timeLeft.minutes} minutes, ${timeLeft.seconds} to smoke a cigarette.`)
            return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false}, ephemeral: true})
        } else {
            let data: User | undefined = await serverService.getUserById(interaction.user.id as string, interaction.guild?.id as string)
            if(data == undefined) {
                data = new User(interaction.user.id, interaction.user.username)
                await serverService.addUser(data, interaction.guild?.id as string)
            }
    
            let user = new User(data!.id, data!.name, data!.balance, data!.cigi)
            await user.cigizik(20, interaction.guild!.id as string, serverService).then(res => {
                embed.addFields({name: "Balance: ", value: `${user.balance}$`})
                if (res) {
                    embed.setDescription(`${interaction.user.displayName} smoked a cigarette.`)
                        .addFields({name: "Smoked cigarettes: ", value: `\`${user.cigi}\``})
                } else {
                    embed.setDescription(`${interaction.user.displayName} can't smoke now.`)
                }
            })  
            smokeCd.addUser(interaction.user.id) 
            return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false}})
        }
    }   
    
  }