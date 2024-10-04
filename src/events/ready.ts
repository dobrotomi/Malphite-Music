import { Events, Client, EmbedBuilder, Colors, ActivityType } from "discord.js"
import { config } from "../config"
import { Logger } from "../utils/logger"
import { deployCommands } from "../deploy-commands";
import { deleteCommands } from "../delete"
import path from "path"
import fs from "fs"
import * as XLSX from 'xlsx'
import { ServerService } from "../services/serverService";
import { webServer } from "../app";
import { NeptunService } from "../services/neptunService";
import { Server, ServerImpl } from "../models/server";


export const data = {
  name: Events.ClientReady,
  once: true
}

export async function execute(client: Client) {




  const sc = new ServerService()
  client.guilds.cache.forEach(async guild => {
    //await deployCommands({ guildId: guild.id });
    //await deleteCommands(guild.id)
    const server: Server = new ServerImpl(guild.id, guild.name)
    //await sc.create(server)
    
  })
  //console.log("Discord bot is ready!")
  Logger.log("Discord bot is ready!", "ready")
  const user = await client.users.fetch(config.OWNER_ID as string)
  const embed = new EmbedBuilder()
    .setColor(0x7CFC00)
    .setTitle("Bot is online!")
    .setDescription(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users`)
    .setTimestamp()
  await user.send({embeds: [embed]})


  /** LAUNCH WEBSERVER */
    await webServer().then(port => {
      Logger.log(`Webserver is listening on port http://${config.IP}:${port.port}`, "web");
      embed.setTitle("Webserver is onilne!")
      embed.setDescription(`Webserver is listening on port http://${config.IP}:${port.port}`)
      user.send({embeds: [embed]})
    }).catch((err) => {
      console.error('Error starting web server:', err);
      embed.setTitle("Error starting web server!")
      embed.setDescription('Error starting web server:\n' + err)
      user.send({embeds: [embed]})
    });
  /** LAUNCH WEBSERVER */
    

  let statuses = ["Music nem megy, várunk az updatera."];
  setInterval(function () {
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    client.user?.setActivity(status, { type: ActivityType.Playing });
  }, 10000)

    checkOrarend(client)
    setInterval(function () {checkOrarend(client)}, 10 * 100 * 60)
}


function checkOrarend(client: Client) {
  
  const folderpath = path.join(__dirname, '../../orarend')
  fs.readdir(folderpath, (err, files) => {
    if (err) {
      console.error(err);
      return
    }
    files.forEach(file => {
      const filepath = path.join(folderpath, file)
      const workbook = XLSX.readFile(filepath)
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(sheet)
      const stringData = JSON.parse(JSON.stringify(jsonData))
      let row = -1;
      stringData.forEach(async (line: { [x: string]: string | number | Date }) => {
        row++;
        const currentDate: Date = new Date();
        const dateToSubtract: Date = new Date(line["Kezdés"]);
        const differenceInMilliseconds: number = dateToSubtract.getTime() - (currentDate.getTime())
        //console.log(differenceInMilliseconds <= 1800000)
        //console.log(differenceInMilliseconds > 0)
        //console.log(stringData[row]["F"] != true)
        //console.log(client.users)
        if (differenceInMilliseconds <= 1800000 && differenceInMilliseconds > 0 && stringData[row]["F"] != true) {//1800000
          //console.log("asd")
         
          if (client.user) {
            const user = client.users.cache.get(file.slice(0, -5))
            if(user != undefined) {
              const neptunService = new NeptunService()
              let content = await neptunService.getNeptunById(user.id)
              

              const embed = new EmbedBuilder()
                .setTitle((line["Összefoglalás"] as string).slice(0, (line["Összefoglalás"] as string).indexOf("(")))
                .setDescription((line["Összefoglalás"] as string).replace("Órarend", ""))
                .setTimestamp()
                .setColor(Colors.Aqua)
                .addFields({ name: "Helyszín:", value: `${line["Helyszín"]}`, inline: false })
                .addFields({ name: "Kezdés:", value: `${line["Kezdés"]}`, inline: true })
                .addFields({ name: "Befejezés:", value: `${line["Befejezés"]}`, inline: true })
              if (line["Leírás"] != "") {
                embed.addFields({ name: "Leírás:", value: `${line["Leírás"]}`, inline: false })
              }
              if (content && content.orarendColor != "") {
                embed.setColor(Colors.Aqua)
              }
              if ((line["Összefoglalás"] as string)[(line["Összefoglalás"] as string).indexOf(")") - 1].toLowerCase() != "e" && content && content.wantEloadas == false) {
                user.send({ embeds: [embed] }).then(() => { }).catch((error) => {
                  Logger.log(`${error}\nCan't send message to user`, "error")
                })
              } else if(content && content.wantEloadas == true) {
                user.send({ embeds: [embed] }).then(() => { }).catch((error) => {
                  Logger.log(`${error}\nCan't send message to user`, "error")
                })
              }
              stringData[row]["F"] = true
              const newWorksheet = XLSX.utils.json_to_sheet(stringData);
              const newWorkbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
              XLSX.writeFile(newWorkbook, filepath);
            }
          }
        }
      })
    })
  })
}
