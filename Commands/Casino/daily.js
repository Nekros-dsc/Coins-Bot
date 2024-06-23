const Discord = require('discord.js');

const cooldownTime = 12 * 60 * 60;
const cooldownsdaily = new Map();

exports.help = {
  name: 'daily',
  aliases: ['dy'],
  description: 'Donne une grosse somme de coins chaque jour',
  use: 'Pas d\'utilisation conseillée',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).daily;
    if (cooldownsdaily.has(message.author.id)) {
        const cooldownExpiration = cooldownsdaily.get(message.author.id) + cooldownTime;
        const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);

        if (remainingCooldown > 0) {
            const hours = Math.floor(remainingCooldown / 3600);
            const minutes = Math.floor((remainingCooldown % 3600) / 60);
            const seconds = Math.floor(remainingCooldown % 60);

            const CouldownEmbed = new Discord.EmbedBuilder()
            .setDescription(`🕐 Vous avez déjà \`daily\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
            .setFooter({ text: config.footerText})
            .setColor(data.color)

            return message.reply({ embeds: [CouldownEmbed] });
        }
    }

    let minimum = JSON.parse(data.gain).dailyMin
    let maximum = JSON.parse(data.gain).dailyMax
    const randomnumber = between(minimum, maximum)

    bot.functions.addCoins(bot, message, args, message.author.id, randomnumber, 'coins')

    const embed = new Discord.EmbedBuilder()
    .setColor(data.color)
    .setTitle(`Daily`)
    .setDescription(`**${text[Math.floor(Math.random() * 15) + 1].replace('{coinsText}', randomnumber)}**\nVous pourrez réutiliser cette commande dans 12 heures !`)
    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
    cooldownsdaily.set(message.author.id, Math.floor(Date.now() / 1000));
    bot.functions.checkLogs(bot, message, args, message.guild.id, randomnumber, 'dailyCoins')
}

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

const text = {
    1: "🌈 En tant que champion de chaque jour, gagnez `{coinsText} coins` pour vos efforts constants. Vous êtes sur la voie du succès !",
    2: "🏅 Vous avez franchi une nouvelle étape dans votre parcours quotidien. Félicitations ! Gagnez `{coinsText} coins` pour votre constance !",
    3: "🌱 Comme une plante qui grandit chaque jour, vous gagnez `{coinsText} coins` pour votre croissance personnelle continue !",
    4: "🏆 Votre routine quotidienne exceptionnelle vous vaut `{coinsText} coins`. Continuez sur cette lancée !",
    5: "🔥 Chaque jour est une nouvelle opportunité. Recevez `{coinsText} coins` pour votre persévérance et votre détermination !",
    6: "⚡ Votre énergie quotidienne est conusernameieuse ! Vous gagnez `{coinsText} coins` pour votre dynamisme et votre passion !",
    7: "🌟 Vous brillez chaque jour un peu plus. Recevez `{coinsText} coins` pour votre éclat constant !",
    8: "🌸 Chaque jour apporte de nouvelles fleurs. Vous gagnez `{coinsText} coins` pour votre beauté intérieure et votre croissance !",
    9: "🚀 Chaque jour vous propulse plus loin. Gagnez `{coinsText} coins` pour votre ambition et vos progrès quotidiens !",
    10: "🏃‍♂️ Votre persévérance quotidienne vous rapporte `{coinsText} coins`. Continuez à avancer à grands pas !",
    11: "💪 Chaque jour vous renforce. Recevez `{coinsText} coins` pour votre force et votre résilience !",
    12: "🌞 Votre lumière quotidienne illumine le monde. Vous gagnez `{coinsText} coins` pour votre rayonnement constant !",
    13: "📅 Chaque jour compte. Recevez `{coinsText} coins` pour votre engagement et votre dévouement quotidiens !",
    14: "🏋️‍♀️ Votre travail acharné quotidien vous rapporte `{coinsText} coins`. Continuez à vous surpasser chaque jour !",
    15: "🌍 Chaque jour, vous faites la différence. Recevez `{coinsText} coins` pour votre impact positif quotidien !"
};