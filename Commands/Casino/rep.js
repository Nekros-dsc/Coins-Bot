const Discord = require('discord.js');

const cooldownsReputation = new Map();

exports.help = {
  name: 'rep',
  aliases: ['reputation' , 'vote' , 'trep'],
  description: 'Vote pour un joueur',
  use: 'rep <@member/teamname>',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).slut;
    if (cooldownsReputation.has(message.author.id)) {
        const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
        const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);

        if (remainingCooldown > 0) {
            const hours = Math.floor(remainingCooldown / 3600);
            const minutes = Math.floor((remainingCooldown % 3600) / 60);
            const seconds = Math.floor(remainingCooldown % 60);

            const CouldownEmbed = new Discord.EmbedBuilder()
            .setDescription(`:x: Vous avez déjà rep quelqu'un\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor(data.color)

            return message.reply({ embeds: [CouldownEmbed] });
        }
    }
    if (!args[0]) return message.reply({ content: ":x: `ERROR:` Veuillez mentionner un membre ou préciser l'ID d'une team !", allowedMentions: { repliedUser: false } })
        if (message.mentions.members.first() || message.guild.members.cache.get(args[0])) {
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!member || member.user.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
            if (member.user.id === message.author.id) return message.channel.send(":x: Vous ne pouvez pas voter pour vous-même !")
            bot.functions.addCoins(bot, message, args, member.id, 1, 'rep')
            cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
            message.reply({ content: `:small_red_triangle: ${member} vient de gagner \`1 réputation\``, allowedMentions: { repliedUser: false } })
            bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de voter pour ${member.user.username}`, 'rep', 'Orange')
        } else {
            let team = await bot.functions.checkTeam(bot, message, args, args[0])
            if (!team) return message.channel.send(`:x: Cette team n'existe pas !`)
            bot.functions.addTeam(bot, message, args, args[0], 1, "rep")
            cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
            message.reply({ content: `:small_red_triangle: La team \`${team.id}\` vient de gagner \`1 réputation\``, allowedMentions: { repliedUser: false } })
            bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de voter pour la team ${team.id}`, 'rep', 'Orange')
        }
}