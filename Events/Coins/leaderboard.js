const Discord = require('discord.js')
const medals = ['🥇', '🥈', '🥉', '4', '5', '6', '7', '8', '9', '10'];
const numeral = require('numeral');

module.exports = {
    name: 'ready',
    async execute(bot) {
        try {
            const inter = setInterval(async () => {

                bot.guilds.cache.forEach(async (guild) => {
                    const dataGuild = bot.functions.checkGuild(bot, null, guild.id)
                    const db = JSON.parse(dataGuild.leaderboard)
                    let channel = await guild.channels.cache.get(db.channel)
                    if (!channel) return;
                    if (channel) {
                        const message = await bot.channels.cache.get(db.channel).messages.fetch(db.msgId).catch(e => { console.log(e) })
                        if (message) {
                            let main = new Discord.ButtonBuilder().setLabel('Top Main').setStyle(Discord.ButtonStyle.Success).setCustomId('main').setEmoji(`<:1198192387726528562:1250792398909345893>`)
                            let bank = new Discord.ButtonBuilder().setLabel('Top Banque').setStyle(Discord.ButtonStyle.Danger).setCustomId('banque').setEmoji(`<:1198192385138634784:1250792397395202079>`)
                            let rep = new Discord.ButtonBuilder().setLabel('Top Rep').setStyle(Discord.ButtonStyle.Secondary).setCustomId('rep').setEmoji(`<:1198192389412622356:1250792395814207590>`)


                            const row = new Discord.ActionRowBuilder().addComponents([main, bank, rep])

                            const embed = new Discord.EmbedBuilder()
                                .setAuthor({ name: `Leaderboard total des coins sur ${message.guild.name}`, iconURL: "https://media.discordapp.net/attachments/1249042420163674153/1250433684721500220/1f911.png?ex=666aec9e&is=66699b1e&hm=ff58c9f200b61ac0e833671620dfdbc6b488d5a88bfef93a0b7d860979d426a0&=&format=webp&quality=lossless&width=921&height=921" })
                                .setColor(dataGuild.color)
                                .setDescription(LBtotal(bot, guild))
                                .setFooter({ text: calculMoyenne(bot)})
                            await message.edit({ embeds: [embed], content: `Last update <t:${Date.parse(new Date) / 1000}>`, components: [row] })


                            const collector = message.createMessageComponentCollector({
                                componentType: Discord.ComponentType.Button,
                                time: 70001
                            })
                            collector.on('collect', async (button) => {
                                await button.deferUpdate();
                                if (button.isButton()) {
                                    if (button.customId === "main") {
                                        const embed = new Discord.EmbedBuilder()
                                            .setDescription(LBmain(bot, guild) ? LBmain(bot, guild) : "Aucune donnée")
                                            .setColor(dataGuild.color)
                                        return button.followUp({ embeds: [embed], ephemeral: true })
                                    }
                                }

                                if (button.customId === "banque") {
                                    const embed = new Discord.EmbedBuilder()
                                    .setDescription(LBbank(bot, guild) ? LBbank(bot, guild) : "Aucune donnée")
                                    .setColor(dataGuild.color)
                                return button.followUp({ embeds: [embed], ephemeral: true })
                                }

                                if (button.customId === "rep") {

                                    const embed = new Discord.EmbedBuilder()
                                    .setDescription(LBrep(bot, guild) ? LBrep(bot, guild) : "Aucune donnée")
                                    .setColor(dataGuild.color)
                                return button.followUp({ embeds: [embed], ephemeral: true })
                                }
                            })
                        }
                    }
                })

            }, 70000)
        }
        catch (e) {
            console.log(e)
        }
    }
}


function LBtotal(bot, guild) {
    let desc = "", count = 0
    const req = bot.db.prepare('SELECT * FROM user').all()
    req.sort((a, b) => (JSON.parse(b.coins).coins + JSON.parse(b.coins).bank) - (JSON.parse(a.coins).coins + JSON.parse(a.coins).bank));
    req.forEach((user, index) => {
        if(JSON.parse(user.coins).bank + JSON.parse(user.coins).coins <= 0) return
        if(count == 9) return
        const user2 = guild.members.cache.get(user.id)
        if(user2) desc += `${medals[index]}) ${user2.user.username}\n\`${JSON.parse(user.coins).bank + JSON.parse(user.coins).coins} coins\` :bank:\n`, count++
    });
    return desc
}

function LBmain(bot, guild) {
    let desc = "", count = 0
    const req = bot.db.prepare('SELECT * FROM user').all()
    req.sort((a, b) => (JSON.parse(b.coins).coins) - (JSON.parse(a.coins).coins));
    req.forEach((user, index) => {
        if(JSON.parse(user.coins).coins <= 0) return 
        if(count == 9) return
        const user2 = guild.members.cache.get(user.id)
        if(user2) desc += `${medals[index]}) ${user2.user.username}\n\`${JSON.parse(user.coins).coins} coins\` :coin:\n`, count++
    });
    return desc
}

function LBbank(bot, guild) {
    let desc = "", count = 0
    const req = bot.db.prepare('SELECT * FROM user').all()
    req.sort((a, b) => (JSON.parse(b.coins).bank) - (JSON.parse(a.coins).bank));
    req.forEach((user, index) => {
        if(JSON.parse(user.coins).bank <= 0) return
        if(count == 9) return
        const user2 = guild.members.cache.get(user.id)
        if(user2) desc += `${medals[index]}) ${user2.user.username}\n\`${JSON.parse(user.coins).bank} coins\` :bank:\n`, count++
    });
    return desc
}

function LBrep(bot, guild) {
    let desc = "", count = 0
    const req = bot.db.prepare('SELECT * FROM user').all()
    req.sort((a, b) => (JSON.parse(b.coins).rep) - (JSON.parse(a.coins).rep));
    req.forEach((user, index) => {
        if(JSON.parse(user.coins).rep <= 0) return
        if(count == 9) return
        const user2 = guild.members.cache.get(user.id)
        if(user2) desc += `${medals[index]}) ${user2.user.username}\n\`${JSON.parse(user.coins).rep} rep\` :small_red_triangle:\n`, count++
    });
    return desc
}

function calculMoyenne(bot) {
    let totalCoins = 0;
    let userCount = bot.db.prepare('SELECT * FROM user').all()

    userCount.forEach(user => {
        const userCoins = JSON.parse(user.coins);
        totalCoins += userCoins.bank + userCoins.coins;
    });

    return userCount > 0 ? `Moyenne d'argent par joueur: ${numeral(totalCoins / userCount.length).format('0a')} coins` : `Moyenne d'argent par joueur: 0 coins`;
}