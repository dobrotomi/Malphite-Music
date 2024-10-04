import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, Message, User } from "discord.js";
import { Queue, Song } from "distube";
import { distube } from "../../distube";

export const data = {
  name: "playSong",
  distube: true
}

export async function execute(queue: Queue, song: Song) {

    let duration = song.duration*1000

    const pauseButton = new ButtonBuilder()
		.setStyle(ButtonStyle.Success)
        .setLabel('Play/Pause')
        .setCustomId('pauseId');
    const skipButton = new ButtonBuilder()
		.setStyle(ButtonStyle.Primary)
        .setLabel('Skip')
        .setCustomId('skipId');
    const stopButton = new ButtonBuilder()
		.setStyle(ButtonStyle.Danger)
        .setLabel('Stop')
        .setCustomId('stopId');
    const queueButton = new ButtonBuilder()
		.setStyle(ButtonStyle.Secondary)
        .setLabel('Queue')
        .setCustomId('queueId');

    const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([ pauseButton, skipButton, stopButton, queueButton ]);

        let player = new EmbedBuilder()
            .setTitle("Playing")
            .setColor("Red")
            .setThumbnail(song.thumbnail!)
            .setFooter({ text: `Request by ${song.user!.tag}`, iconURL: song.user!.displayAvatarURL() });

        if (song.playlist) {
            player.setDescription(`Start playing playlist \n[${song.playlist.name}](${song.playlist.url}) \`[${song.playlist.songs.length} songs]\`\n\nStart playing \n[${song.name}](${song.url})`)
                    .addFields({name: "Duration", value: `\`[${song.formattedDuration}]\``, inline: true},
                                {name: "Queue", value: `\`[${queue.formattedDuration}]\``, inline: true},
                                {name: "Volume", value: `\`${queue.volume}%\``, inline: true}
                    )
            let embed = await queue.textChannel!.send({ embeds: [ player ], components: [ row ] });

            setTimeout(() => { 
                embed.delete().catch(error => {
                    if (error.code === 10008) return;
                });
            }, duration);

            await playButton(queue, duration, embed, song)

        } else {
            player.setDescription(`Start playing \n[${song.name}](${song.url})`)
                    .addFields({name: "Duration", value: `\`[${song.formattedDuration}]\``, inline: true},
                                {name: "Queue", value: `\`[${queue.formattedDuration}]\``, inline: true},
                                {name: "Volume", value: `\`${queue.volume}%\``, inline: true}
)
    
            let embed = await queue.textChannel!.send({ embeds: [ player ], components: [ row ] });
    
            setTimeout(() => { 
                embed.delete().catch(error => {
                    if (error.code === 10008) return;
                });
            }, duration);
    
            await playButton(queue, duration, embed, song)
        }

        async function playButton(queue: Queue, duration: number, embed: Message, song: Song) {
            const collector = embed.createMessageComponentCollector({ 
                filter: (interaction) => queue.voiceChannel!.members.has(interaction.user.id),
                time: duration,
            });
        
            collector.on('collect', async (i) => {
                if (queue.songs[0] !== song) return
        
                let buttonEmbed = new EmbedBuilder()
                    .setFooter({ text: `Request by ${i.user.tag}`, iconURL: i.user.displayAvatarURL() })
                    .setTimestamp()
                
                if (i.customId === 'pauseId') {
                    if (queue.paused) { 
                        distube.resume(i.message); 
                        i.reply("").catch(e => {})

                    } else {
                        distube.pause(i.message);    
                        i.reply("").catch(e => {})
                    }
                } else if (i.customId === 'skipId') {
                    distube.skip(i.message)
                    .then(() => {
                        i.reply("").catch(e => {})
                        embed.delete().catch(e => {})
                    })
                    .catch(error => {
                        if (error.code === "NO_UP_NEXT") {
                            distube.stop(i.message)
                            .then(() => {
                                i.reply("").catch(e => {})
                                embed.delete().catch(e => {})
                            })
                            .catch(error => {
                                return 
                            });
                        } else {
                            return 
                        }
                    });
                } else if (i.customId === 'stopId') {
                    distube.stop(i.message);
                    i.reply("").catch(e => {})
                    embed.delete().catch(e => {})
                } else if (i.customId === 'queueId') {
                    if(queue.songs.length > 1) {
                        const arrays = queue.songs.map((song, id) => `**${id + 1}**. [${song.name}](${song.url})`); 
                        const embed = new EmbedBuilder()
                            .setColor("Red")
                            .setTitle(`Queue:`)
                            .setFooter({ text: `Request by ${i.user.tag} •`, iconURL: i.user.displayAvatarURL() });
                            
                        const footer = "songs";
                        const timeout = 120000;
            
                        await button(i, arrays, embed, footer, timeout);
                    } else {
                        const embed = new EmbedBuilder()
                            .setTitle(`Queue:`)
                            .setColor("Red")
                            .setDescription("Queue is empty")
                            .setFooter({ text: `Request by ${i.user.tag} •`, iconURL: i.user.displayAvatarURL() });
                        i.reply({embeds: [embed]})
                    }
                    
                }
            });
        }



        async function button(i: any, arrays: string[], embed: EmbedBuilder, footer: string, timeout: number) {

            const backId = 'backId';
            const forwardId = 'forwardId';
            const backButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('backId')
                .setEmoji('⏪');

                const forwardButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('forwardId')
                .setEmoji('⏩');
        
            
            const array = arrays;
        
            const generateEmbed = async (start: number) => {
                const current = array.slice(start, start + 10);
                
                embed.setDescription(current.join('\n') + `\n\nShowing ${footer} ${start + 1}-${start + current.length} out of ${array.length}`);
                return embed;
            }
        
            const canFitOnOnePage = array.length <= 10
        
            const row1 = new ActionRowBuilder<ButtonBuilder>()
                .addComponents([ forwardButton ]);
        
            const embeds = await generateEmbed(0)
        
        
        
            const embedMessage = await i.reply({
                embeds: [ embeds ],
                components: canFitOnOnePage ? [] : [ row1 ]
                
            });
        
            if (canFitOnOnePage) return;
        
            const collector = embedMessage.createMessageComponentCollector({ 
                filter: (user: User) => user.id === i.user.id, 
                time: timeout,
                componentType: 2
            });
        
            let currentIndex = 0;
        
            collector.on('collect', async (interaction: ButtonInteraction) => {
                console.log(interaction.customId)
                interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10)
                interaction.customId === forwardId ? (currentIndex += 10) : (currentIndex -= 10)
        
                const row2 = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([ ...(currentIndex ? [backButton] : []), ...(currentIndex + 10 < array.length ? [forwardButton] : []) ]);
        
                const embed = await generateEmbed(currentIndex);
                interaction.message.edit({
                    embeds: [ embed ],
                    components: [ row2 ]
                })
                
            });
            collector.on("end", (collected: any) => {
                //embedMessage.edit({ components: [] });
                //i.editReply({ components: [] })
                i.deleteReply()
            });

    }
}


