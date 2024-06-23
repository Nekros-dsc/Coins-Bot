var items = require('../../Utils/Functions/shop.json')
const Discord = require("discord.js");

const cooldownsReputation = new Map();

exports.help = {
    name: 'recolt',
    aliases: ["drugs" , "rt"],
    description: 'Récolte la drogue',
    use: 'Pas d\'utilisation conseillée',
    category: 'Illegal'
  }
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).recolt;
    message.delete().catch(e => { })
    let capa = bot.functions.checkUser(bot, message, args, message.author.id).capacite
    if (capa === "cultivateur") {
        if (cooldownsReputation.has(message.author.id)) {
            const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
            const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);
    
            if (remainingCooldown > 0) {
                const hours = Math.floor(remainingCooldown / 3600);
                const minutes = Math.floor((remainingCooldown % 3600) / 60);
                const seconds = Math.floor(remainingCooldown % 60);
    
                const CouldownEmbed = new Discord.EmbedBuilder()
                .setDescription(`:x: Vous avez déjà \`recolt\`\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setColor(data.color)
    
                return message.reply({ embeds: [CouldownEmbed] });
            }
        }
      let gains = JSON.parse(data.gain)
      let minimum = gains.drugsMin || 1
      let maximum = gains.drugsMax || 2 
      const randomnumber = between(minimum, maximum)
      bot.functions.addCoins(bot, message, args, message.author.id, randomnumber, 'drugs')
      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:pill: Un joueur vient de récolter \`${randomnumber} 💊\``)
        .setFooter({ text: `Commande Anonyme` })
        cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
      message.channel.send({ embeds: [embed5], allowedMentions: { repliedUser: false } })

    } else message.channel.send({
      embeds: [new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous devez avoir la capacité **cultivateur** pour utiliser cette commande !`)
        .setFooter({ text: `Commande Anonyme` })], ephemeral: true
    })
}   

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}