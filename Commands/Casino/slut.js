const Discord = require('discord.js');

const cooldownsReputation = new Map();

exports.help = {
  name: 'slut',
  aliases: ['st'],
  description: 'Fais gagner une somme de coins',
  use: 'Pas d\'utilisation conseillée',
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
            .setDescription(`🕐 Vous avez déjà \`rep\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
            .setFooter({ text: config.footerText})
            .setColor(data.color)

            return message.reply({ embeds: [CouldownEmbed] });
        }
    }

    let gains = JSON.parse(data.gain)
    let minimum = gains.slutMin
    let maximum = gains.slutMax
    const randomnumber = between(minimum, maximum)
    bot.functions.addCoins(bot, message, args, message.author.id, randomnumber, 'coins')

    let embed5 = new Discord.EmbedBuilder()
    .setColor(data.color)
    .setDescription(`:coin: ${message.author.username}, Vous venez de gagner \`${randomnumber} coins\``)
    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
    message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } })
    cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));

}

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}