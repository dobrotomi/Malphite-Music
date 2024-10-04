//blackjack
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client, EmbedBuilder } from "discord.js"
import { ServerService } from "../../services/serverService";
import { User } from "../../models/serverUser"
import { CommandInfo } from "../../models/commandInfo";
const blackjack = require("discord-blackjack")

export const data = new SlashCommandBuilder()
  .setName("blackjack")
  .setDescription("Blackjack")
  .addIntegerOption(option =>
    option.setName("bet").setDescription("Your bet").setRequired(true).setMinValue(1).setMaxValue(100000));

export const info: CommandInfo = {
    name: "blackjack",
    description: "Play blackjack",
    group: "Economy"
}

export async function execute(interaction: CommandInteraction, client: Client) {
    
    const serverService = new ServerService()
    let bet = interaction.options.data[0].value as number
    let user: User | undefined = await serverService.getUserById(interaction.user.id as string, interaction.guild?.id as string)
    if(user == undefined) {
      user = new User(interaction.user.id, interaction.user.username)
      //await serverService.addUser(user, interaction.guild?.id as string)
    }

    if(user.balance < bet) {
        const embed = new EmbedBuilder()
            .setTitle("Blackjack")
            .setColor(0xFF0000)
            .setTimestamp()
            .setDescription(`You don't have enough money to bet ${bet}$`)
        return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true, components: []})
    }
    
    /*
    const embed = new EmbedBuilder()
        .setTitle("Blackjack")
        .setTimestamp()
        .addFields(
            {name: `${interaction.user.username}'s hand`, value: "\u200B", inline: true},
            {name: `Dealer's Hand`, value: "\u200B", inline: true}
        )
        */
    let game = await blackjack(interaction, {transition: "edit", split: false, doubledown: false})//normalEmbed: true, normalEmbedContent: embed,

    //console.log(game)
    

    const result = new EmbedBuilder()
            .setTitle("Blackjack result")
            .setTimestamp()
            

    switch(game.result) {
        case "WIN":
            result.setColor(0x008800)
                switch (game.method) {
                    case "You had blackjack":
                        user.balance += bet*1.5
                        result.addFields({name: "You won:", value: `${bet*1.5}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                    case "You had more":
                        user.balance += bet
                        result.addFields({name: "You won:", value: `${bet}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                    case "Dealer busted":
                        user.balance += bet
                        result.addFields({name: "You won:", value: `${bet}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                }
                break;
            case "LOSE":
                user.balance -= bet
                result.setColor(0xFF0000)
                switch (game.method) {
                    case "You busted":
                        result.addFields({name: "You lost:", value: `${bet}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                    case "Dealer had blackjack":
                        result.addFields({name: "You lost:", value: `${bet}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                    case "Dealer had more":
                        result.addFields({name: "You lost:", value: `${bet}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                }
                break
            case "DOUBLE WIN":
                bet = bet*2
                result.setColor(0x008800)
                switch (game.method) {
                    case "You had blackjack":
                        user.balance += bet*1.5
                        result.addFields({name: "You won:", value: `${bet*1.5}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                    case "You had more":
                        user.balance += bet
                        result.addFields({name: "You won:", value: `${bet}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                    case "Dealer busted":
                        user.balance += bet
                        result.addFields({name: "You won:", value: `${bet}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                }
                break
            case "DOUBLE LOSE":
                bet = bet*2
                user.balance -= bet
                result.setColor(0xFF0000)
                switch (game.method) {
                    case "You busted":
                        result.addFields({name: "You lost:", value: `${bet}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                    case "Dealer had blackjack":
                        result.addFields({name: "You lost:", value: `${bet}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                    case "Dealer had more":
                        result.addFields({name: "You lost:", value: `${bet}$`, inline: true},
                                         {name: `Bet: `, value: `${bet}$`, inline: true},
                                         {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                        break
                }
                break
            case "TIE":
                result.setColor(0xFFFF00)
                result.addFields({name: "You won:", value: `${bet}$`, inline: true},
                                 {name: `Bet: `, value: `${bet}$`, inline: true},
                                 {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                break
            case "DOUBLE TIE":
                result.setColor(0xFFFF00)
                result.addFields({name: "You won:", value: `${bet}$`, inline: true},
                                 {name: `Bet: `, value: `${bet}$`, inline: true},
                                 {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                break
            case "CANCEL":
                result.setColor(0xFFFF00)
                result.addFields({name: "Game cancelled, bets are refunded", value: `${bet}$`, inline: true},
                                 {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                break
            case "TIMEOUT":
                result.setColor(0xFFFF00)
                result.addFields({name: "Game timed out, bets are refunded", value: `${bet}$`, inline: true},
                                 {name: "Your balance is:", value: `${user.balance}$`, inline: true})
                break
    }
    

    serverService.updateUser(user, interaction.guild?.id as string)
    return interaction.editReply({embeds: [result], allowedMentions: { repliedUser: false }});
  }