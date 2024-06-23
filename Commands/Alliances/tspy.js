const Discord = require('discord.js');
var rslow = require('../../Utils/function/roulette.js')

const cooldownTime = 1 * 60 * 60;
const cooldownsReputation = new Map();

exports.help = {
  name: 'tspy',
  aliases: ['tas'],
  description: 'Permet de voir le nombre de troupes dans une team adverse',
  use: 'tspy <teamid>',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    if (cooldownsReputation.has(message.author.id)) {
        const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
        const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);

        if (remainingCooldown > 0) {
            const hours = Math.floor(remainingCooldown / 3600);
            const minutes = Math.floor((remainingCooldown % 3600) / 60);
            const seconds = Math.floor(remainingCooldown % 60);

            const CouldownEmbed = new Discord.EmbedBuilder()
            .setDescription(`:x: Vous avez déjà \`tattack\` quelqu'un\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor(data.color)

            return message.reply({ embeds: [CouldownEmbed] });
        }
    }
    if (!isNaN(args[0]) || message.mentions.members.first() || !args[0]) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      if (!member) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
      authorteam = bot.functions.checkUserTeam(bot, message, args, member.id)
    } else authorteam = bot.functions.checkTeam(bot, message, args, args[0])
    if (!authorteam) return message.reply(":x: Veuillez préciser une team existante")
    let verifteam = bot.functions.checkUserTeam(bot, message, args, message.author.id)
    if (verifteam && verifteam.id == authorteam.id) return message.reply(":x: Vous ne pouvez pas \`tspy\` votre propre team !")


        cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
    return message.reply(`📡 \`${authorteam.army || 0} troupes\` sont stockées dans la team **${authorteam.name}** !`)
}