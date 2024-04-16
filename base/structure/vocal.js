const Discord = require('discord.js'),
    { wait } = require("../../base/functions");
var rate = require('../../roulette.js');
const getUser = require('../functions/getUser');
const checkGuild = require('../functions/checkGuild');
const color = require('../functions/color');
const { Users } = require('../Database/Models/Users');
module.exports = {
    name: 'ready',

    run: async (client) => {
        setInterval(function () {

            client.guilds.cache.forEach(async guild => {

                let guildDB = await checkGuild(client.user.id, guild.id)
                let gains = guildDB.Gains || {}
                let voicegain = gains.voicegain
                let streamgain = gains.streamgain
                let camgain = gains.camgain
                if (voicegain || streamgain || camgain) {
                    let idUser = [];
                    let count = 0;
                    let difarrr = guildDB.FarmChannels || {}
                    difarr = Object.keys(difarrr).map(key => key);
                    let vc
                    if (!difarr || difarr.length < 1) {
                        vc = guild.channels.cache.filter(c => c.type === 'GUILD_VOICE' || c.type === 'GUILD_STAGE_VOICE');
                    } else {
                        vc = guild.channels.cache.filter(c => difarr.includes(c.id) && c.type === 'GUILD_VOICE' || difarr.includes(c.id) && c.type === 'GUILD_STAGE_VOICE');
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
                        let memberDB = await getUser(member.id, guild.id);
                        if (member && memberDB) {
                            if (!member.user.bot) {

                                try {
                                    let dataguild = await checkGuild(client.user.id, guild.id)
                                    let userDB = await getUser(member.id, guild.id)

                                    let gain = 0
                                    let activity = []

                                    if (!memberDB.Vocal) continue
                                    memberDB.increment('ThreeMinutes', { by: 1 });
                                    if (parseInt(memberDB.ThreeMinutes) + 1 >= 3) {
                                        if (member.voice.channel) {

                                            //XP
                                            let xpdata = dataguild.XP || {}
                                            let xpvc = xpdata.vocxp || 10
                                            if (xpdata.xp !== false && xpdata.msgxp !== 0 && userDB) {
                                                await userDB.increment('XP', { by: xpvc });
                                                let lvlup = userDB.level
                                                let xp = userDB.XP + xpvc
                                                /*if (lvlup * 1000 <= xp) {
                                                    await userDB.increment('level', { by: 1 });
                                                    Users.update({ XP: 0 }, { where: { primary: userDB.primary }});
                                                    userDB.increment('Coins', { by: lvlup * 1000 });
                                                }*/
                                            }
                                            //

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
                                            if (difarrr[member.voice.channel.id] && !isNaN(difarrr[member.voice.channel.id])) {
                                                gain = gain * parseInt(difarrr[member.voice.channel.id]);
                                            }
                                            if (gain) memberDB.increment('Coins', { by: parseInt(gain) });
                                            Users.update({ ThreeMinutes: 0 }, { where: { primary: userDB.primary } });
                                            if (rate.rate !== true) {
                                                let lchannel = dataguild.Logs["vocal"]
                                                if (lchannel) {
                                                    let asend = guild.channels.cache.get(lchannel)
                                                    activity = activity.join(", ")

                                                    if (asend) {
                                                        const embedcolor = await color(member.id, guild.id, client)
                                                        asend.send({ embeds: [new Discord.EmbedBuilder().setColor(embedcolor).setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL({ dynamic: true }) }).setDescription(`${member} vient de gagner \`${gain} coins\` en étant en \`${activity}\``).setTimestamp()] }).catch(e => { })
                                                    }
                                                }
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