const Discord = require('discord.js')

module.exports = {
    name: 'ready',
    async execute(bot) {
        setInterval(async () => {
            bot.guilds.cache.forEach(async (guild) => {
                let guildDB = bot.functions.checkGuild(bot, null, guild.id)
                let impotss = JSON.parse(guildDB.gain).impots
                if (parseInt(impotss) > 0) {
                    let teams = bot.db.prepare('SELECT * FROM team').all()
                    const teamsArray = teams.map(({ id, name, members }) => ({ id, name, members }));

                    for (i of teamsArray) {
                        let team = bot.functions.checkTeam(bot, null, null, i.id)
                        if (team) {
                            if (!team.coins) continue;
                            let finallb = await JSON.parse(team.members).length
                            if (finallb <= 0 || !finallb) {
                                bot.db.exec(`DELETE FROM team WHERE id = '${team.id}'`);
                                continue;
                            }
                            let impots = impotss * finallb
                            if (finallb <= 1) impots = impots * 6
                            if (parseInt(team.coins) < impots) continue;
                            bot.functions.removeTeam(bot, null, null, team.id, impots, "coins")
                            let lchannel = JSON.parse(guildDB.logs).impots
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
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}