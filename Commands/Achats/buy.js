const Discord = require('discord.js');
var items = require("../../Utils/function/shop.json");
const ms = require('ms')
exports.help = {
  name: 'buy',
  aliases: ['bought'],
  description: 'Permets d\'acheter les items du shop du bot',
  use: 'Pas d\'utilisation conseillée',
  category: 'Achats'
}
exports.run = async (bot, message, args, config, data) => {
    let userDB = bot.functions.checkUser(bot, message, args, message.author.id)
    let author = JSON.parse(userDB.coins).coins

    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Sélectionner un item à acheter')
        );
    let antirobduration = JSON.parse(data.gain).antirob.time
    let shoparray = []
    for (i in items.bat) {
        const gain = JSON.parse(data.gain)[i].gain;
        const price = JSON.parse(data.gain)[i].price
        shoparray.push(`**${i.replace(i[0], i[0].toUpperCase())}**\nPrix: ${price}\nGain: ${gain}`)
        row.components[0].addOptions([{
            label: '[BAT] ' + i.replace(i[0], i[0].toUpperCase()),
            description: `Prix: ${price} | Gain: ${gain}`,
            value: i
        }]);
    }


    let wprice = JSON.parse(data.gain).wagon
    let rprice = JSON.parse(data.gain).antirob.price

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
                userDB = bot.functions.checkUser(bot, message, args, message.author.id)
                author = JSON.parse(userDB.coins).coins
                if (value == "wagon") {
                    let Embed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:x: Vous avez besoin de ${wprice} pour acheter un **wagon**`);
                    if (author < wprice) {
                        return message.reply({ embeds: [Embed2], allowedMentions: { repliedUser: false } })
                    }
                    let use = bot.functions.addMinerais(bot, message, args, message.author.id, 10, 'wagon')
                    let Embed3 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:white_check_mark: Vous avez acheté un **wagon** pour \`${wprice} coins\` !\nVous pouvez maintenant miner ${JSON.parse(userDB.minerais).wagon} fois avant de devoir en racheter un !`)
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                    bot.functions.removeCoins(bot, message, args, message.author.id, wprice, 'coins')
                    message.reply({ embeds: [Embed3], allowedMentions: { repliedUser: false } })
                    

                } else if (value == "antirob") {
                    let Embed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:x: Vous avez besoin de ${rprice} pour acheter un **anti rob**`);
                    if (author < rprice) {
                        
                        return message.reply({ embeds: [Embed2], allowedMentions: { repliedUser: false } })
                    }
                    bot.db.prepare(`UPDATE user SET antirob = @coins WHERE id = @id`).run({ coins: Math.floor(parseInt(Date.now()) + ms(antirobduration)), id: message.author.id});
                    bot.functions.removeCoins(bot, message, args, message.author.id, rprice, 'coins')

                    let timetime = msToTime(antirobduration);
                    let embed5 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:white_check_mark: Vous avez acheté un **anti-rob**, vous avez ${timetime} d'anti-rob !\n`)
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                    message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } })
                    
                } else {
                    let bat = items.bat
                    let price = JSON.parse(data.gain)[value].price
                    let Embed = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:x: Vous avez besoin de ${price} pour acheter le bâtiment **${value}**`);
                    if (author < price) {
                        
                        return message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } })
                    }

                    let bats = JSON.parse(userDB.batiment).batiments

                    if (bats.includes(value)) {
                        return message.channel.send(`:x: Vous avez déjà le bâtiment **${value}**`);}

                   bats.push(value)

                   const json = {
                    "count": JSON.parse(userDB.batiment).count,
                    "batiments": bats
                }
                bot.db.prepare(`UPDATE user SET batiment = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
                    bot.functions.removeCoins(bot, message, args, message.author.id, price, 'coins')
                    let Embed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:white_check_mark: Vous avez acheté **${value}** pour \`${price} coins\``);
                    message.reply({ embeds: [Embed2], allowedMentions: { repliedUser: false } })
                    
                }
        collector.on("end", async () => {
            return m.edit({ content: "Expiré !", components: [] }).catch(() => { })
        })
    })
})
}

function msToTime(duration) {
    var seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    let timeString = "";

    if (hours) {
        timeString += `${hours} heure${hours > 1 ? "s" : ""}, `;
    }
    if (minutes) {
        timeString += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    if (seconds && !hours && !minutes) {
        timeString += `${seconds} seconde${seconds > 1 ? "s" : ""}`;
    }

    return timeString;
}