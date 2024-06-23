const Discord = require('discord.js');

const cooldownsdaily = new Map();

exports.help = {
  name: 'mine',
  aliases: [],
  description: 'Mine des minerais',
  use: 'Pas d\'utilisation conseillée',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
  const cooldownTime = JSON.parse(data.time).mine;
    let user = bot.functions.checkUser(bot, message, args, message.author.id)
    const mineData = JSON.parse(user.minerais)
    if (mineData.wagon == 0) {
        const nowEmbed = new Discord.EmbedBuilder()
          .setColor(data.color)
          .setFooter({
            text: message.member.user.username,
            iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(":x: Vous devez acheter un wagon avant de pouvoir utiliser cette commande !\nExemple: `buy wagon`");
        return message.reply({ embeds: [nowEmbed], allowedMentions: { repliedUser: false } });
    }

    if (cooldownsdaily.has(message.author.id)) {
        const cooldownExpiration = cooldownsdaily.get(message.author.id) + cooldownTime;
        const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);
    
        if (remainingCooldown > 0) {
            const hours = Math.floor(remainingCooldown / 3600);
            const minutes = Math.floor((remainingCooldown % 3600) / 60);
            const seconds = Math.floor(remainingCooldown % 60);
    
            const CouldownEmbed = new Discord.EmbedBuilder()
            .setDescription(`🕐 Vous avez déjà \`wagon\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}\nUtilisez la commande \`wagon\` pour vendre vos minerais\n\n**__Inventaire:__**\n**Charbon:** ${mineData.charbon || 0}\n**Fer:** ${mineData.fer || 0}\n**Or:** ${mineData.or || 0}\n**Diamant:** ${mineData.diamant || 0}`)
            .setFooter({
                text: message.member.user.username,
                iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
            })
            .setColor(data.color)
            .setThumbnail("https://media.discordapp.net/attachments/1249042420163674153/1249042473053978784/pioche-removebg-preview.png?ex=6665dcf3&is=66648b73&hm=f5f85e1a2faa2f09ac1b9cdc81f07069f9aec65d56f962e2bad30cef0a5031f0&=&format=webp&quality=lossless&width=809&height=809")
    
            return message.reply({ embeds: [CouldownEmbed] });
        }
    }

    const randomnumber = between(0, 9);
    const minerais = randomnumber <= 3 ? "charbon" : randomnumber <= 5 || randomnumber === 8 ? "fer" : randomnumber <= 7 ? "or" : "diamant";

    const numb = between(1, 2);
    await bot.functions.addMinerais(bot, message, args, message.author.id, numb, minerais)

    const embed5 = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setThumbnail("https://media.discordapp.net/attachments/1249042420163674153/1249042473053978784/pioche-removebg-preview.png?ex=6665dcf3&is=66648b73&hm=f5f85e1a2faa2f09ac1b9cdc81f07069f9aec65d56f962e2bad30cef0a5031f0&=&format=webp&quality=lossless&width=809&height=809")
      .setDescription(`:pick: ${message.author.username}, Vous venez de gagner \`${numb} ${minerais}(s)\`\nUtilisez la commande \`wagon\` pour vendre vos minerais !`)
      .setFooter({
        text: message.member.user.username,
        iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
      });

    message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } });
    await bot.functions.removeMinerais(bot, message, args, message.author.id, 1, "wagon")

    user = bot.functions.checkUser(bot, message, args, message.author.id)
    cooldownsdaily.set(message.author.id, Math.floor(Date.now() / 1000));
    if (JSON.parse(user.minerais).wagon <= 0) {
      message.channel.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(":pick: Oh non ! Votre wagon vient de se casser !\nUtilisez la commande `buy wagon` pour en acheter un nouveau !")
            .setFooter({
              text: message.member.user.username,
              iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    }
  
}   

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}