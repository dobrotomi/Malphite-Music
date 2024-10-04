import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client } from "discord.js"
let request = require("request")
let fs = require("fs")
import path from "path";
import { CommandInfo } from "../../models/commandInfo";
import { Neptun } from "../../models/neptun";
import { NeptunService } from "../../services/neptunService";

export const data = new SlashCommandBuilder()
  .setName("neptun")
  .setDescription("Orarend")
  .addSubcommand(sub => sub.setName("add").setDescription("Set your timetable")
  .addAttachmentOption(option => 
    option.setName("orarend")
    .setDescription("Timetable.xlsx")
    .setRequired(true)))
  .addSubcommand(sub => sub.setName("settings").setDescription("Change your timetable settings.")
  .addBooleanOption(option =>
    option.setName("eloadas")
    .setDescription("Want eloadás?"))
  )

  /**
   * .addStringOption(option => 
    option.setName("color")
    .setDescription("Change the color of the message")
    .addChoices(
        { name: 'Default', value: "0" },
        { name: 'White', value: "16777215" },
        { name: 'Aqua', value: "1752220" },
        { name: 'Green', value: "5763719" },
        { name: 'Blue', value: "3447003" },
        { name: 'Yellow', value: "16705372" },
        { name: 'Purple', value: "10181046" },
        { name: 'LuminousVividPink', value: "15277667" },
        { name: 'Fuchsia', value: "15418782" },
        { name: 'Gold', value: "15844367" },
        { name: 'Orange', value: "15105570" },
        { name: 'Red', value: "15548997" },
        { name: 'Grey', value: "9807270" },
        { name: 'Navy', value: "3426654" },
        { name: 'DarkAqua', value: "1146986" },
        { name: 'DarkGreen', value: "2067276" },
        { name: 'DarkBlue', value: "2123412" },
        { name: 'DarkPurple', value: "7419530" },
        { name: 'DarkVividPink', value: "11342935" },
        { name: 'DarkGold', value: "12745742" },
        { name: 'DarkOrange', value: "11027200" },
        { name: 'DarkRed', value: "10038562" },
        { name: 'DarkGrey', value: "9936031" },
        { name: 'DarkerGrey', value: "8359053" },
        { name: 'LightGrey', value: "12370112" },
        { name: 'DarkNavy', value: "2899536" },
        { name: 'Blurple', value: "5793266" },
        { name: 'Greyple', value: "10070709" },
        { name: 'DarkButNotBlack', value: "2895667" },
        { name: 'NotQuiteBlack', value: "2303786" })))
   */
    
    /*
    .addChoices(
        { name: 'Default', value: 0 },
        { name: 'White', value: 16777215 },
        { name: 'Aqua', value: 1752220 },
        { name: 'Green', value: 5763719 },
        { name: 'Blue', value: 3447003 },
        { name: 'Yellow', value: 16705372 },
        { name: 'Purple', value: 10181046 },
        { name: 'LuminousVividPink', value: 15277667 },
        { name: 'Fuchsia', value: 15418782 },
        { name: 'Gold', value: 15844367 },
        { name: 'Orange', value: 15105570 },
        { name: 'Red', value: 15548997 },
        { name: 'Grey', value: 9807270 },
        { name: 'Navy', value: 3426654 },
        { name: 'DarkAqua', value: 1146986 },
        { name: 'DarkGreen', value: 2067276 },
        { name: 'DarkBlue', value: 2123412 },
        { name: 'DarkPurple', value: 7419530 },
        { name: 'DarkVividPink', value: 11342935 },
        { name: 'DarkGold', value: 12745742 },
        { name: 'DarkOrange', value: 11027200 },
        { name: 'DarkRed', value: 10038562 },
        { name: 'DarkGrey', value: 9936031 },
        { name: 'DarkerGrey', value: 8359053 },
        { name: 'LightGrey', value: 12370112 },
        { name: 'DarkNavy', value: 2899536 },
        { name: 'Blurple', value: 5793266 },
        { name: 'Greyple', value: 10070709 },
        { name: 'DarkButNotBlack', value: 2895667 },
        { name: 'NotQuiteBlack', value: 2303786 })
    ))
    */
    
export const info: CommandInfo = {
    name: "neptun",
    description: "Set your university notifications",
    group: "University"
}        
        

export async function execute(interaction: CommandInteraction, client: Client) {
    const neptunService = new NeptunService()


    if(interaction.options.data[0].name == "add"){
        //console.log(interaction.options.data[0].options![0].attachment!.url)
        const url = interaction.options.data[0].options![0].attachment!.url
    
        async function download(url: string){
            
            if(interaction.options.data[0].options![0].attachment!.name.endsWith(".xlsx")) {
                request.get(url)
                .on('error', console.error)
                .pipe(fs.createWriteStream(path.join(__dirname, `../../../orarend/${interaction.user.id}.xlsx`)));
                const user: Neptun = {
                    id: interaction.user.id,
                    name: interaction.user.username,
                    orarendColor: "",
                    wantEloadas: true
                }
                await neptunService.createNeptun(user)
            }    
        }
        await download(url)
        return interaction.reply({ephemeral: true, content: "Órarend feltöltve"})
    }

    if(interaction.options.data[0].name == "settings"){
        let eloadas = true;
        let color = "";
        //console.log(interaction.options.data[0].options![0].value)
        //console.log(interaction.options.data[1].value)
        if(interaction.options.data[0].options![0] != undefined) eloadas = interaction.options.data[0].options![0].value as boolean;
        if(interaction.options.data[0].options![1] != undefined) color = interaction.options.data[0].options![1].value as string;
        
        //console.log(color)

        await neptunService.getNeptunById(interaction.user.id).then(async u => {
            //console.log(u?.wantEloadas)
            if(u != undefined) {
                u.wantEloadas = eloadas;
                u.orarendColor = color;
                //console.log(u?.wantEloadas)
                await neptunService.editNeptun(u).then(ret => {
                    //console.log(ret)
                    return interaction.reply({ephemeral: true, content: `Settings saved!`})
                })
            } else {
                //console.log("create")
                
                const user: Neptun = {
                    id: interaction.user.id,
                    name: interaction.user.username,
                    orarendColor: color,
                    wantEloadas: eloadas
                }
                //console.log(user)
                await neptunService.createNeptun( user ).then(() => {
                    
                    return interaction.reply({ephemeral: true, content: `Settings saved! :)`})
                })
            }
        })
    }
}