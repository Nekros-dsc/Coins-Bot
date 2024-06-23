const Discord = require('discord.js');

exports.help = {
  name: 'blacklist',
  aliases: ['bl'],
  description: 'Ajoute ou retire un membre de la blacklist coins',
  use: 'blacklist <add/remove/list/reset> <@user/id>',
  category: 'Administration',
  perm: "OWNER"
}
exports.run = async (bot, message, args, config, data) => {
    const type = args[0]
    let blacklistUserArray = JSON.parse(data.blacklist)
    if(type?.toLowerCase() == "list") {
        const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle(`Blacklist Coins`)
        .setDescription(`> Voici la liste des membres blacklist coins:\n\n${blacklistUserArray.length !== 0 ? blacklistUserArray.map(u => `<@${u}> (id: ${u})`).join('\n') : "Aucun membre blacklist !"}`)
        .setFooter({ text: config.footerText });
        return message.reply({ embeds: [embed]})
    } else if(type?.toLowerCase() == "add") {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if (!member || member.user.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } });
        if(!blacklistUserArray.includes(member.id)) blacklistUserArray.push(member.id)
        const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle(`Blacklist Coins`)
        .setDescription(`:white_check_mark: ${member} a bien été **ajouté à la blacklist coins** du serveur !`)
        .setFooter({ text: config.footerText });
        bot.db.prepare(`UPDATE guild SET blacklist = @coins WHERE id = @id`).run({ coins: JSON.stringify(blacklistUserArray), id: message.guild.id});
        return message.reply({ embeds: [embed]})
    } else if(type?.toLowerCase() == "remove") {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if (!member || member.user.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } });
        blacklistUserArray = blacklistUserArray.filter(u => u !== member.id)
        const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle(`Blacklist Coins`)
        .setDescription(`:white_check_mark: ${member} a bien été **retiré à la blacklist coins** du serveur !`)
        .setFooter({ text: config.footerText });
        bot.db.prepare(`UPDATE guild SET blacklist = @coins WHERE id = @id`).run({ coins: JSON.stringify(blacklistUserArray), id: message.guild.id});
        return message.reply({ embeds: [embed]})
    } else if(type?.toLowerCase() == "reset") {
        const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle(`Blacklist Coins`)
        .setDescription(`:recycle: ${blacklistUserArray.length} membres ont été retiré de la blacklist coins !`)
        .setFooter({ text: config.footerText });
        bot.db.prepare(`UPDATE guild SET blacklist = @coins WHERE id = @id`).run({ coins: JSON.stringify([]), id: message.guild.id});
        return message.reply({ embeds: [embed]})
    } else {
        const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle(`Blacklist Coins`)
        .setDescription(`:x: Il manque un argument !\nEx: \`${data.prefix}blacklist <add/remove/list/reset>\``)
        .setFooter({ text: config.footerText });
        return message.reply({ embeds: [embed]})
    }
}