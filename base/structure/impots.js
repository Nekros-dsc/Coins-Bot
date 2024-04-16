const Discord = require('discord.js'),
{ wait } = require("../../base/functions");
const { Teams } = require('../Database/Models/Teams');
const checkGuild = require('../functions/checkGuild');
const getTeam = require('../functions/teams/getTeam');
module.exports = {
    name: 'ready',

    run: async (client) => {
        try {
            setInterval(async () => {
                client.guilds.cache.forEach(async (guild) => {
                    let guildDB = await checkGuild(client.user.id, guild.id)
                    let impotss =(guildDB.Prices||{})["impotsprice"] || 10
                    if (parseInt(impotss) > 0) {
                        let teams = await Teams.findAll({
                            where: {
                                guildId: guild.id
                            }
                        });
                        const teamsArray = teams.map(({ teamid, name, members }) => ({ teamid, name, members }));

                        for (i of teamsArray) {
                            let team = await getTeam(i.name, false, guild.id, false)
                            if (team) {
                                if (!team.coins) continue;
                                let finallb = await (Object.entries(JSON.parse(team.members)).map(i => i[0])).length
                                if (finallb <= 0 || !finallb) {
                                    team.destroy();
                                    continue;
                                }
                                let impots = impotss * finallb
                                if (finallb <= 1) impots = impots * 4
                                if (parseInt(team.coins) < impots) continue;
                                team.decrement('coins', { by: impots });
                                let lchannel = (guildDB.Logs||{})["impots"]
                                let asend = guild.channels.cache.get(lchannel)
                                if (asend) {
                                    asend.send({ embeds: [new Discord.EmbedBuilder().setColor('#0B19F5').setAuthor({ name: team.name }).setDescription(`La team ${team.name} vient de payer \`${impots} coins\` d'impôt pour héberger ses ${finallb} membres !`).setTimestamp()] })
                                    await wait(1000)
                                }
                            }
                        }

                    }
                })

            }, 14400000) //14400000
        }
        catch (e) {
            console.log(e)
        }
    }
}