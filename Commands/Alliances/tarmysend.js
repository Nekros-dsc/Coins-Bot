const Discord = require('discord.js');
var rslow = require('../../Utils/function/roulette.js')

exports.help = {
  name: 'tarmysend',
  aliases: ['tas'],
  description: 'Permets d\'envoyer des troupes à une autre team',
  use: 'tarmysend <teamid> <troupes>',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let authorteam = bot.functions.checkUserTeam(bot, message, args, message.author.id)
    if (!JSON.parse(authorteam.coins).rep || parseInt(JSON.parse(authorteam.coins).rep) < 5) return message.channel.send(`:military_helmet: Vous devez avoir au moins 5 réputations de team pour débloquer l'armée !`)

    if (!isNaN(args[0]) || message.mentions.members.first() || !args[0]) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
        targetteam = bot.functions.checkUserTeam(bot, message, args, member.id)
    } else targetteam = bot.functions.checkTeam(bot, message, args, args[0])
    if (!targetteam) return message.channel.send(`:x: Vous n'avez pas de team !`)
    if (rslow.allattacks[message.guild.id, "-", authorteam.id]) return message.reply(`:x: Vous êtes en guerre, veuillez attendre la fin de celle-ci pour envoyer des troupes`)

        if (authorteam.id == targetteam.id) return message.channel.send(`:x: Vous ne pouvez pas vous envoyer des renforts !`)
        if (!args[1] || !verifnum(args[1])) return message.reply(":x: Vous devez préciser le nombre de soldats que vous envoyez !")

        if (!authorteam.army || parseInt(authorteam.army) <= 0) return message.reply(":x: Vous n'avez pas d'armée !\nVeuillez faire la commande \`tarmy\` pour initialiser votre armée !")
        if (parseInt(authorteam.army)< args[1]) return message.reply(":x: Vous n'avez pas autant de troupes !")
            bot.db.prepare(`UPDATE team SET army = @coins WHERE id = @id`).run({ coins: authorteam.army - args[1], id: authorteam.id});
        bot.db.prepare(`UPDATE team SET army = @coins WHERE id = @id`).run({ coins: authorteam.army + args[1], id: targetteam.id});
        return message.reply(`📡 \`${args[1]} troupes\` ont bien été envoyé à la team **${targetteam.name}** !`)
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}