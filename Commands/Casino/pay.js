const Discord = require('discord.js');

exports.help = {
  name: 'pay',
  aliases: [],
  description: 'Envois de l\'argent à un autre joueur',
  use: 'pay <user> <amount/all>',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
    const req = bot.functions.checkUser(bot, message, args, message.author.id)
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member || member.user.bot) {
        return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })}

    if (member.user.id === message.author.id) {
        return message.reply({ content: ":x: Vous ne pouvez pas vous envoyer de l'argent !", allowedMentions: { repliedUser: false } })}
    let amount = args[1]
    let bal = JSON.parse(req.coins).coins
    if (!amount) {
        return message.reply({ content: `:x: Merci de préciser un montant à payer`, allowedMentions: { repliedUser: false } })}
    if (!verifnum(amount)) {
        return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } })}
    amount = parseInt(amount)
    let embedbank = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(":x: Vous n'avez pas d'argent à payer !")
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
    let embed3 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous ne pouvez pas payer un montant négatif`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

    if (amount <= 0) {
        return message.reply({ embeds: [embed3], allowedMentions: { repliedUser: false } })
    }
    if (bal === 0){
         return message.reply({ embeds: [embedbank], allowedMentions: { repliedUser: false } })}

    let moneymore = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous n'avez pas assez de coins`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
    if (amount > bal) {
        return message.reply({ embeds: [moneymore], allowedMentions: { repliedUser: false } });}

        await bot.functions.addCoins(bot, message, args, member.user.id, amount, 'coins')
        await bot.functions.removeCoins(bot, message, args, message.author.id, amount, 'coins')

    message.reply({ content: `:coin: Vous venez de payer \`${member.user.username}\` un montant de \`\`${amount} coins\`\``, allowedMentions: { repliedUser: false } })
    await bot.functions.addCoins(bot, message, args, message.author.id, { timestamp: Math.floor(Date.now() / 1000), message: `:red_circle: Vous avez payé ${member.user.username} un montant de \`${amount} coins\``}, 'mail')
    bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de payer \`\`${amount} coins\`\``, 'pay', 'Red')

}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}