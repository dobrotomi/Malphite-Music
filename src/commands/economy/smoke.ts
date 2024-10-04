import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client, EmbedBuilder, Colors } from "discord.js"
import { ServerService } from "../../services/serverService";
import { User, UserImpl } from "../../models/user"
import { Server, ServerImpl } from "../../models/server";
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
    let server: ServerImpl | undefined = await serverService.getServerById(interaction.guild?.id!)

    if (server === undefined) {
        server = new ServerImpl(interaction.guild?.id!, interaction.guild?.name!)
        await serverService.createServer(server)
    }

    server = new ServerImpl(server.id, server.name, server.joinedAt, server.djrole, server.volume, server.users);

    let user: UserImpl | undefined = server.getUser(interaction.user.id)
    if (user === undefined) {
        user = new UserImpl(interaction.user.id, interaction.user.username)
        await server.addUser(user)
    }

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
            embed.setDescription(`You need to wait ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds to smoke a cigarette.`)
            return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false}, ephemeral: true})
        } else {    
            user = new UserImpl(user.id, user.name, user.balance, user.cigi)

            user.cigizik()
            await server.updateUser(user)
            //await serverService.updateUser(user,  interaction.guild?.id as string)
            

            embed.addFields({name: "Balance: ", value: `${user.balance}$`})
            
            embed.setDescription(`${interaction.user.displayName} smoked a cigarette.`)
                .addFields({name: "Smoked cigarettes: ", value: `\`${user.cigi}\``})


            smokeCd.addUser(interaction.user.id) 
            return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false}})
        }
    }   
    
  }