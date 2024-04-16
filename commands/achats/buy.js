const Discord = require('discord.js');
const { msToTime } = require("../../base/functions");
var items = require("../../shop.json");
const addMinerais = require('../../base/functions/addMinerais');
const getUser = require('../../base/functions/getUser');
const setCooldown = require('../../base/functions/setCooldown');
const removeCoins = require('../../base/functions/removeCoins');
module.exports = {
    name: "buy",
    description: "Permets d'acheter les items du shop du bot",
    aliases: ['bought'],

    run: async (client, message, args, data) => {
        let userDB = await getUser(message.member.id, message.guild.id);
        let author = userDB.Coins

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Sélectionner un item à acheter')
            );
        let antirobduration = data.guild.Cooldowns["antirob"] || 7200000
        let shoparray = []
        for (i in items.bat) {
            const gain = (data.guild.Gains || {})[`${i}gain`] || items.bat[i].gain
            const price = (data.guild.Prices || {})[`${i}price`] || items.bat[i].price
            shoparray.push(`**${i.replace(i[0], i[0].toUpperCase())}**\nPrix: ${price}\nGain: ${gain}`)
            row.components[0].addOptions([{
                label: '[BAT] ' + i.replace(i[0], i[0].toUpperCase()),
                description: `Prix: ${price} | Gain: ${gain}`,
                value: i
            }]);
        }


        let wprice = (data.guild.Prices || {})["wagonprice"] || items.other.wagon.price
        let rprice = (data.guild.Prices || {})["antirobprice"] || items.other.antirob.price

        row.components[0].addOptions([{
            label: '[OTHER] anti-rob',
            description: `Protège des vols`,
            value: "antirob"
        },
        {
            label: '[OTHER] wagon',
            description: `Donne accès aux commandes "mine" et "wagon"`,
            value: "wagon"
        }])

        let Embed2 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Voici la boutique du serveur ` + message.guild.name)
            .setDescription(`${shoparray.map(e => e).join("\n")}
**anti-rob**\nPrix: ${rprice}\nDéfini le temps d'anti-rob à ${msToTime(antirobduration)}
**wagon**\nPrix: ${wprice}\nAccès aux commandes \`mine\` et \`wagon\``)
            .setFooter({ text: `Les récompenses des bâtiments sont attribuées toutes les 2h30` })
        message.reply({ embeds: [Embed2], components: [row] }).then(m => {

            const collector = m.createMessageComponentCollector({
                componentType: Discord.ComponentType.SelectMenu,
                time: 30000
            })
            collector.on("collect", async (select) => {
                if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                const value = select.values[0]
                await select.deferUpdate()
                client.queue.addJob(async (cb) => {
                    userDB = await getUser(message.member.id, message.guild.id);
                    author = parseInt(userDB.Coins)
                    if (value == "wagon") {
                        let Embed2 = new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:x: Vous avez besoin de ${wprice} pour acheter un **wagon**`);
                        if (author < wprice) {
                            cb()
                            return message.reply({ embeds: [Embed2], allowedMentions: { repliedUser: false } })
                        }
                        let use = await addMinerais(message.author.id, message.guild.id, "wagon", 10, true)
                        let Embed3 = new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:white_check_mark: Vous avez acheté un **wagon** pour \`${wprice} coins\` !\nVous pouvez maintenant miner ${use.wagon} fois avant de devoir en racheter un !`)
                            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                        userDB.decrement('Coins', { by: wprice });
                        //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: Vous avez acheté un \`wagon\` pour \`\`${wprice} coins\`\``)
                        message.reply({ embeds: [Embed3], allowedMentions: { repliedUser: false } })
                        cb()

                    } else if (value == "antirob") {
                        let Embed2 = new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:x: Vous avez besoin de ${rprice} pour acheter un **anti rob**`);
                        if (author < rprice) {
                            cb()
                            return message.reply({ embeds: [Embed2], allowedMentions: { repliedUser: false } })
                        }
                        await setCooldown(message, data.color, message.author.id, message.guild.id, "antirob", antirobduration, false, true, true)
                        userDB.decrement('Coins', { by: rprice });

                        let timetime = msToTime(antirobduration);
                        let embed5 = new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:white_check_mark: Vous avez acheté un **anti-rob**, vous avez ${timetime} d'anti-rob !\n`)
                            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                        //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: Vous avez acheté un \`anti-rob\` pour \`\`${rprice} coins\`\``)
                        message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } })
                        cb()
                    } else {
                        let bat = items.bat
                        let price = data.guild.Prices[`${value}price`] || bat[value].price
                        let Embed = new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:x: Vous avez besoin de ${price} pour acheter le bâtiment **${value}**`);
                        if (author < price) {
                            cb()
                            return message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } })
                        }

                        let bats = userDB.Batiments || {}
                        if (typeof bats === 'string') {
                            bats = JSON.parse(bats);
                        }

                        if (bats[value]) {cb()
                            return message.channel.send(`:x: Vous avez déjà le bâtiment **${value}**`);}

                        bats[value] = true;

                        await data.users.update({ Batiments: bats }, { where: { primary: userDB.primary } });
                        //await userDB.decrement('Coins', { by: price });
                        await removeCoins(message.member.id, message.guild.id, price, "Coins")
                        let Embed2 = new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:white_check_mark: Vous avez acheté **${value}** pour \`${price} coins\``);
                        //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: Vous avez acheté un \`${value}\` pour \`\`${bat[value].price} coins\`\``)
                        message.reply({ embeds: [Embed2], allowedMentions: { repliedUser: false } })
                        cb()
                    }
                })
            })
            collector.on("end", async () => {
                return m.edit({ content: "Expiré !", components: [] }).catch(() => { })
            })
        })
    }
}

