//hourly, daily, weekly, monthly free coin
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client, EmbedBuilder } from "discord.js"
import { ServerService } from "../../services/serverService";
import { User, UserImpl } from "../../models/user"
import { CommandCooldown, msToMinutes } from "discord-command-cooldown";
import ms from "ms";
import { CommandInfo } from "../../models/commandInfo";
import { ServerImpl } from "../../models/server";

export const data = new SlashCommandBuilder()
    .setName("coins")
    .setDescription("Claim your free coins")
    .addSubcommand(sub => sub.setName("hourly").setDescription("Claim your hourly free coins. (100$)"))
    .addSubcommand(sub => sub.setName("daily").setDescription("Claim your daily free coins. (500$)"))
    .addSubcommand(sub => sub.setName("weekly").setDescription("Claim your weekly free coins. (3000$)"))
    .addSubcommand(sub => sub.setName("monthly").setDescription("Claim your monthly free coins. (10000$)"))

export const info: CommandInfo = {
    name: "coins",
    description: "Claim your free coins",
    group: "Economy"
}

export async function execute(interaction: CommandInteraction, client: Client) {
    const serverService = new ServerService()
    const embed = new EmbedBuilder()
    let server: ServerImpl | undefined = await serverService.getServerById(interaction.guild?.id!)

    if (server === undefined) {
        server = new ServerImpl(interaction.guild?.id!, interaction.guild?.name!)
        await serverService.createServer(server)
    }

    server = new ServerImpl(server.id, server.name, server.joinedAt, server.djrole, server.volume, server.users);

    let user = server.getUser(interaction.user.id)

    if (user === undefined) {
        user = new UserImpl(interaction.user.id, interaction.user.username)
        await server.addUser(user)
    }

    switch (interaction.options.data[0].name) {
        case "hourly":
            const hourlyCd = new CommandCooldown("hourly", ms("1h"))
            const userOnCd = await hourlyCd.getUser(interaction.user.id)
            embed
                .setTitle("Hourly")
                .setTimestamp()
            if (userOnCd) {
                const timeLeft = msToMinutes(userOnCd.msLeft, false)
                embed.setDescription(`You need to wait ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds to claim this reward again.`)
                return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
            } else {
                user.balance += 100
                await server.updateUser(user)
                await hourlyCd.addUser(interaction.user.id)

                embed.setDescription(`Yaay! +100$!\nYour balance is ${user.balance}$`)
                return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
            }
        case "daily":
            const dailyCd = new CommandCooldown("daily", ms("24h"))
            const userDailyOnCd = await dailyCd.getUser(interaction.user.id)
            embed
                .setTitle("Daily")
                .setTimestamp()
            if (userDailyOnCd) {
                const timeLeft = msToMinutes(userDailyOnCd.msLeft, false)
                embed.setDescription(`You need to wait ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds to claim this reward again.`)
                return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
            } else {
                user.balance += 500
                await server.updateUser(user)
                await dailyCd.addUser(interaction.user.id)

                embed.setDescription(`Yaay! +500$!\nYour balance is ${user.balance}$`)
                return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
            }
        case "weekly":
            const weeklyCd = new CommandCooldown("weekly", ms("168h"))
            const userWeeklyOnCd = await weeklyCd.getUser(interaction.user.id)
            embed
                .setTitle("Weekly")
                .setTimestamp()
            if (userWeeklyOnCd) {
                let days = Math.floor(userWeeklyOnCd.msLeft / ms("24h"))
                const timeLeft = msToMinutes(userWeeklyOnCd.msLeft % ms("24h"), false)
                embed.setDescription(`You need to wait ${days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds to claim this reward again.`)
                return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
            } else {
                user.balance += 3000
                await server.updateUser(user)
                await weeklyCd.addUser(interaction.user.id)

                embed.setDescription(`Yaay! +3000$!\nYour balance is ${user.balance}$`)
                return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
            }
        case "monthly":
            const monthlyCd = new CommandCooldown("monthly", ms("720h"))
            const userMonthlyOnCd = await monthlyCd.getUser(interaction.user.id)
            embed
                .setTitle("Monthly")
                .setTimestamp()
            if (userMonthlyOnCd) {
                let days = Math.floor(userMonthlyOnCd.msLeft / ms("24h"))
                const timeLeft = msToMinutes(userMonthlyOnCd.msLeft % ms("24h"), false)

                embed.setDescription(`You need to wait ${days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds to claim this reward again.`)
                return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
            } else {
                user.balance += 10000
                await server.updateUser(user)
                await monthlyCd.addUser(interaction.user.id)

                embed.setDescription(`Yaay! +10000$!\nYour balance is ${user.balance}$`)
                return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
            }
    }
}