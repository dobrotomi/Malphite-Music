//roulette
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Message, MessageComponentInteraction } from "discord.js"
import { User, UserImpl } from "../../models/user";
import { ServerService } from "../../services/serverService";
import { CommandInfo } from "../../models/commandInfo";
import { ServerImpl } from "../../models/server";

export const data = new SlashCommandBuilder()
  .setName("roulette")
  .setDescription("Roulette")
  .addIntegerOption(option =>
    option.setName("bet").setDescription("Your bet").setRequired(true).setMinValue(1).setMaxValue(100000));
    
export const info: CommandInfo = {
    name: "roulette",
    description: "Play roulette",
    group: "Economy"
}

export async function execute(interaction: CommandInteraction, client: Client) {
    //await interaction.deferReply()
    let bet = interaction.options.data[0].value as number
    const serverService = new ServerService()
    
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

    if(user.balance < bet) {
        const embed = new EmbedBuilder()
            .setTitle("Roulette")
            .setColor(0xFF0000)
            .setTimestamp()
            .setDescription(`You don't have enough money to bet ${bet}$`)
        return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false}, ephemeral: true})
    }
    
    const embed = new EmbedBuilder()
        .setTitle("Roulette")//ㅤㅤㅤㅤㅤㅤㅤ ㅤㅤ ㅤ - itt van a roulett középrehelyező
        .setImage("https://t3.ftcdn.net/jpg/03/00/20/62/360_F_300206258_b1RhGTAJqFyKOtFSnqE3yrT2Ps3PIntj.jpg")
        .setTimestamp()
    const row1 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("0")
                .setLabel(`ㅤ ㅤ ‎ㅤ ㅤ ㅤ 0 ㅤ ㅤ ‎ㅤ ㅤ ㅤ`)
                .setStyle(ButtonStyle.Success)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("number")
                .setLabel("ㅤ ㅤ ㅤㅤ Number ㅤ ㅤㅤ ㅤ")
                .setStyle(ButtonStyle.Primary)
        )
    const row2 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("1st12")
                .setLabel(" ㅤ ㅤ 1st12 ㅤ ㅤ ")
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("2nd12")
                .setLabel("ㅤㅤㅤ2nd12ㅤㅤㅤ")
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("3rd12")
                .setLabel(" ㅤ ㅤ 3rd12 ㅤ ㅤ ")
                .setStyle(ButtonStyle.Primary)
        )

    const row3 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("even")
                .setLabel("‎ ‎‎‎ ‎  ‎ ‎   EVEN ‎ ‎‎‎ ‎  ‎ ‎  ")
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("red")
                .setLabel("ㅤ‎ ‎ ‎  RED  ‎‎ ‎ ㅤ")
                .setStyle(ButtonStyle.Danger)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("black")
                .setLabel("ㅤ BLACK ㅤ")
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("odd")
                .setLabel("ㅤ‎  ODD ‎ ㅤ")
                .setStyle(ButtonStyle.Primary)
        )

    const row4 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("1to18")
                .setLabel("ㅤ ㅤ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ㅤ 1to18 ㅤ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ㅤ ㅤ")
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("19to36")
                .setLabel("ㅤ ㅤ ‎ ‎ ‎ ‎ ‎ ‎ ㅤ 19to36 ㅤ ‎ ‎ ‎ ‎ ‎ ‎ ㅤ ㅤ")
                .setStyle(ButtonStyle.Primary)
        )
        

    const numbers = [
        { number: 0, color: "Green", series: 0, third: 0 },
        { number: 1, color: "Red", series: "small", third: 1 },
        { number: 2, color: "DarkButNotBlack", series: "small", third: 1 },
        { number: 3, color: "Red", series: "small", third: 1 },
        { number: 4, color: "DarkButNotBlack", series: "small", third: 1 },
        { number: 5, color: "Red", series: "small", third: 1 },
        { number: 6, color: "DarkButNotBlack", series: "small", third: 1 },
        { number: 7, color: "Red", series: "small", third: 1 },
        { number: 8, color: "DarkButNotBlack", series: "small", third: 1 },
        { number: 9, color: "Red", series: "small", third: 1 },
        { number: 10, color: "DarkButNotBlack", series: "small", third: 1 },
        { number: 11, color: "DarkButNotBlack", series: "small", third: 1 },
        { number: 12, color: "Red", series: "small", third: 1 },
        { number: 13, color: "DarkButNotBlack", series: "small", third: 2 },
        { number: 14, color: "Red", series: "small", third: 2 },
        { number: 15, color: "DarkButNotBlack", series: "small", third: 2 },
        { number: 16, color: "Red", series: "small", third: 2 },
        { number: 17, color: "DarkButNotBlack", series: "small", third: 2 },
        { number: 18, color: "Red", series: "small", third: 2 },
        { number: 19, color: "Red", series: "big", third: 2 },
        { number: 20, color: "DarkButNotBlack", series: "big", third: 2 },
        { number: 21, color: "Red", series: "big", third: 2 },
        { number: 22, color: "DarkButNotBlack", series: "big", third: 2 },
        { number: 23, color: "Red", series: "big", third: 2 },
        { number: 24, color: "DarkButNotBlack", series: "big", third: 2 },
        { number: 25, color: "Red", series: "big", third: 3 },
        { number: 26, color: "DarkButNotBlack", series: "big", third: 3 },
        { number: 27, color: "Red", series: "big", third: 3 },
        { number: 28, color: "DarkButNotBlack", series: "big", third: 3 },
        { number: 29, color: "DarkButNotBlack", series: "big", third: 3 },
        { number: 30, color: "Red", series: "big", third: 3 },
        { number: 31, color: "DarkButNotBlack", series: "big", third: 3 },
        { number: 32, color: "Red", series: "big", third: 3 },
        { number: 33, color: "DarkButNotBlack", series: "big", third: 3 },
        { number: 34, color: "Red", series: "big", third: 3 },
        { number: 35, color: "DarkButNotBlack", series: "big", third: 3 },
        { number: 36, color: "Red", series: "big", third: 3 }
    ]

    let game = numbers[Math.floor(numbers.length * Math.random())];
    //let game = numbers[1];

    


    let gamemessage = await interaction.reply({ embeds: [embed], components: [row1, row2, row3, row4] })

        

        
    const collectorFilter = (i: MessageComponentInteraction): boolean => {
        return i.user.id === interaction.user.id
    }
    const numberFilter = (message: Message): boolean => {
        return message.author.id === interaction.user.id
    }
    
    await gamemessage.awaitMessageComponent({filter: collectorFilter, componentType: ComponentType.Button})
        .then(async i => {
            await i.deferUpdate()
            

            user!.balance -= bet
            switch (i.customId) {
                case "number":
                    embed.setTitle("Roulette").setDescription("Type a number in the chat.")
                    var message = await interaction.editReply({ embeds: [embed], components: [] })
                    var number = await interaction.channel?.awaitMessages({ filter: numberFilter,  max: 1, time: 30000, errors: ["time"] })
                    await interaction.editReply({embeds: [embed], components: []})
                    
                    
                    if ( number?.first()?.content as unknown as number == game.number) {
                        user!.balance += bet*35
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*35}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }
                    break
                case "0":
                    if (game.number == 0) {
                        user!.balance += bet*37
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*37}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }

                    break
                case "1st12":
                    if (game.third == 1) {
                        user!.balance += bet*3.08
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*3.08}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }
                    break
                case "2nd12":
                    if (game.third == 2) {
                        user!.balance += bet*3.08
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*3.08}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                                                {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }
                    break
                case "3rd12":
                    if (game.third == 3) {
                        user!.balance += bet*3.08
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*3.08}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                                                {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }
                    break
                case "red":
                    if (game.color == "Red") {
                        user!.balance += bet*2.05
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*2.05}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                                                {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }
                    break
                case "black":
                    if (game.color == "DarkButNotBlack") {
                        user!.balance += bet*2.05
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*2.05}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                                                {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }
                    break
                case "even":
                    if ((game.number % 2) == 0 && game.number != 0) {
                        user!.balance += bet*2.05
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*2.05}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                                                {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }
                    break
                case "odd":
                    if ((game.number % 2) != 0 && game.number != 0) {
                        user!.balance += bet*2.05
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*2.05}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                                                {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }
                    break
                case "1to18":
                    if (game.series == "small") {
                        user!.balance += bet*2.05
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*2.05}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                                                {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }
                    break
                case "19to36":
                    if (game.series == "big") {
                        user!.balance += bet*2.05
                        embed.setColor(0x008800).addFields({name: `You won:`, value: `${bet*2.05}$`, inline: true},
                                                           {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    } else {
                        embed.setColor(0xFF0000).addFields({name: `You lost:`, value: `${bet}$`, inline: true},
                                                                                {name: "Your balance is:", value: `${user?.balance}$`, inline: true})
                        interaction.editReply({ embeds: [embed], components: [] })
                    }
                    break

            }
        })

        embed.setDescription(`Number: ${game.number}`)
        interaction.editReply({ embeds: [embed], components: [] })
        

        await server.updateUser(user)
        
        //setTimeout(() => {interaction.deleteReply()}, 30000)


    
}