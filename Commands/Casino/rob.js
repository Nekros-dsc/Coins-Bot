const Discord = require('discord.js');

const cooldownsReputation = new Map();

exports.help = {
  name: 'rob',
  aliases: [],
  description: 'Vole l\'argent de la main d\'un autre joueur',
  use: 'rob <@user>',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).rob;
    if (cooldownsReputation.has(message.author.id)) {
        const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
        const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);

        if (remainingCooldown > 0) {
            const hours = Math.floor(remainingCooldown / 3600);
            const minutes = Math.floor((remainingCooldown % 3600) / 60);
            const seconds = Math.floor(remainingCooldown % 60);

            const CouldownEmbed = new Discord.EmbedBuilder()
            .setDescription(`🕐 Vous avez déjà \`rob\` quelqu'un\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor(data.color)

            return message.reply({ embeds: [CouldownEmbed] });
        }
    }
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!user) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
    let targetuser = bot.functions.checkUser(bot, message, args, user.id)
    
    if (targetuser.antirob > Date.now()) {
        
        let timeEmbed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:shield: Vous ne pouvez pas rob cet utilisateur\n\n Son anti-rob prendra fin dans <t:${Math.floor(targetuser.antirob / 1000)}:R> `)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
        return message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false } })
    } else {
        let moneyEmbed0 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:x: Vous ne pouvez pas vous rob vous-même !`)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
        if (message.author.id === user.user.id) return message.reply({ embeds: [moneyEmbed0], allowedMentions: { repliedUser: false } })

        let moneyEmbed2 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:x: ${user.user.username} n'a pas d'argent à voler !`)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
        if (parseInt(JSON.parse(targetuser.coins).coins) <= 1) {
            return message.reply({ embeds: [moneyEmbed2], allowedMentions: { repliedUser: false } })
        }
        const checkif = between(0, 3)
        if (checkif === 2) {
            let fail = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(` Vous n'avez pas réussi à rob ${user.user.username} !`)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            return message.reply({ embeds: [fail], allowedMentions: { repliedUser: false } })
        }

        let random = between(1, parseInt(JSON.parse(targetuser.coins).coins))

        let embed = new Discord.EmbedBuilder()
            .setDescription(`:white_check_mark: Vous avez volé ${user} et repartez avec \`${random} coins\` en plus`)
            .setColor(data.color)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
        bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de voler \`\`${random} coins\`\` à ${user.user.username}`, 'rob', 'Green')
        bot.functions.checkLogs(bot, message, args, message.guild.id, `${user.user.username} vient de se faire voler \`\`${random} coins\`\` par ${message.author.username}`, 'rob', 'Red')
        await bot.functions.addCoins(bot, message, args, message.author.id, random, 'coins')
        await bot.functions.removeCoins(bot, message, args, user.user.id, random, 'coins')
        await bot.functions.addCoins(bot, message, args, message.author.id, { timestamp: Math.floor(Date.now() / 1000), message: `:green_circle: Vous avez volé ${user.user.username} un total de \`${random} coins\``}, 'mail')
        await bot.functions.addCoins(bot, message, args, user.user.id, { timestamp: Math.floor(Date.now() / 1000), message: `:red_circle: ${message.author.username} vous a volé \`${random} coins\``}, 'mail')
    };
}

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}