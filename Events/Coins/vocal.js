const Discord = require('discord.js')

module.exports = {
    name: 'ready',
    async execute(bot) {
        setInterval(function () {

            bot.guilds.cache.forEach(async guild => {

                let guildDB = bot.functions.checkGuild(bot, null, guild.id)
                let gains = JSON.parse(guildDB.gain)
                let voicegain = gains.voicegain
                let streamgain = gains.streamgain
                let camgain = gains.camgain
                if (voicegain || streamgain || camgain) {
                    let idUser = [];
                    let count = 0;
                    let difarrr = JSON.parse(guildDB.farmChannel)
                    let difarr = difarrr.map(key => key);
                    let vc
                    if (!difarr || difarr.length < 1) {
                        vc = guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildVoice || c.type === Discord.ChannelType.GuildStageVoice);
                    } else {
                        vc = guild.channels.cache.filter(c => difarr.includes(c.id) && c.type ===  Discord.ChannelType.GuildVoice || difarr.includes(c.id) && c.type === Discord.ChannelType.GuildStageVoice);
                    }
                    
                    const voiceChannels = vc
                    for (const [id, voiceChannel] of voiceChannels) {
                        voiceChannel.members.forEach(member => {
                            idUser.push(member.user.id)
                        });

                        count += voiceChannel.members.size;
                    }

                    let membercount = idUser.length;

                    for (let i = 0; i < membercount; i++) {
                        await wait(500)
                        let member = guild.members.cache.get(idUser[i]);
                        let memberDB = bot.functions.checkUser(bot, null, null, member.user.id)
                        if (member && memberDB) {
                            if (!member.user.bot) {

                                try {
                                    let dataguild = bot.functions.checkGuild(bot, null, guild.id)
                                    let userDB = bot.functions.checkUser(bot, null, null, member.id)

                                    let gain = 0
                                    let activity = []
                                    if (memberDB.enableVocal == "on") continue
                                        if (member.voice.channel) {
                                            let json = JSON.parse(memberDB.palier)
                                            let xpdata = JSON.parse(dataguild.xp)
                                            let xpvc = xpdata.vocxp || 10
                                            if (xpdata.xp !== false && xpdata.msgxp !== 0 && userDB) {
                                                json["xp"] = Number(json.xp) + Number(xpvc)
                                                bot.db.prepare(`UPDATE user SET palier = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: member.id});
                                            }
                                            activity.push("vocal")
                                            gain = gain + parseInt(voicegain)

                                            if (member.voice.selfVideo) {
                                                if (!isNaN(camgain)) {
                                                    gain = gain + parseInt(camgain)
                                                    activity.push("caméra")
                                                }

                                            } if (member.voice.streaming) {


                                                if (!isNaN(streamgain)) {
                                                    gain = gain + parseInt(streamgain)
                                                    activity.push("stream")
                                                }
                                            }
                                            if (difarrr.some(c => c.id == member.voice.channel.id) && !isNaN(difarrr.some(c => c.id == member.voice.channel.id).coeff)) {
                                                gain = gain * parseInt(difarrr.some(c => c.id == member.voice.channel.id).coeff);
                                            }
                                            if (gain) bot.functions.addCoins(bot, null, null, member.user.id, gain, 'coins')
                                                bot.db.prepare(`UPDATE user SET ThreeMinutes = @coins WHERE id = @id`).run({ coins: 0, id: member.id});
                                                let lchannel = JSON.parse(dataguild.xp).vocal
                                                if (lchannel) {
                                                    let asend = guild.channels.cache.get(lchannel)
                                                    activity = activity.join(", ")

                                                    if (asend) {
                                                        asend.send({ embeds: [new Discord.EmbedBuilder().setColor(guildDB.color).setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL({ dynamic: true }) }).setDescription(`${member} vient de gagner \`${gain} coins\` en étant en \`${activity}\``).setTimestamp()] }).catch(e => { })
                                                    }
                                                }
                                        }
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                        }
                    }
                }
            })
        }, 300000); //300000
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}