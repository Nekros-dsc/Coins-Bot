const Discord = require('discord.js');

const cooldownsdaily = new Map();

exports.help = {
  name: 'gift',
  aliases: ['gft'],
  description: 'Génère trois cartes, choisissez la bonne !',
  use: 'Pas d\'utilisation conseillée',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
  const cooldownTime = JSON.parse(data.time).gift;
  if (cooldownsdaily.has(message.author.id)) {
    const cooldownExpiration = cooldownsdaily.get(message.author.id) + cooldownTime;
    const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);

    if (remainingCooldown > 0) {
        const hours = Math.floor(remainingCooldown / 3600);
        const minutes = Math.floor((remainingCooldown % 3600) / 60);
        const seconds = Math.floor(remainingCooldown % 60);

        const CouldownEmbed = new Discord.EmbedBuilder()
        .setDescription(`🕐 Vous avez déjà \`gift\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
        .setFooter({ text: config.footerText})
        .setColor(data.color)

        return message.reply({ embeds: [CouldownEmbed] });
    }
  }

  let minimum = JSON.parse(data.gain).cardsMin
  let maximum = JSON.parse(data.gain).cardsMax

  let button1 = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('1').setEmoji("1️⃣")
  let button2 = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('2').setEmoji("2️⃣")
  let button3 = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('3').setEmoji("3️⃣")


  let button_row = new Discord.ActionRowBuilder().addComponents([button1, button2, button3])
  let embed5 = new Discord.EmbedBuilder()
      .setTitle(`Trois cartes sont à votre disposition...`)
      .setColor(data.color)
      .setDescription(`Choisissez une des cartes ci-dessous !\nEt tentez de gagner entre \`${minimum} coins\` et \`${maximum} coins\` !\n:warning: Elles expirent dans <t:${Date.parse(new Date(Date.now() + 60000)) / 1000}:R> !`)
      .setImage("https://media.discordapp.net/attachments/1249042420163674153/1249042506406957188/coinsbot_gift.png?ex=6665dcfb&is=66648b7b&hm=441047c01a5e9a0ed557db51ae1a088fd914f29c052e5589d453cff4a9859b14&=&format=webp&quality=lossless&width=809&height=539")
      .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
  message.reply({ embeds: [embed5], components: [button_row], allowedMentions: { repliedUser: false } }).then(async msg => {
      const collector = msg.createMessageComponentCollector({
          componentType: Discord.ComponentType.Button,
          time: 60000
      })

      collector.on("collect", async (i) => {
          collector.stop()
          if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces boutons !", ephemeral: true }).catch(() => { })
            if (cooldownsdaily.has(message.author.id)) {
              const cooldownExpiration = cooldownsdaily.get(message.author.id) + cooldownTime;
              const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);
          
              if (remainingCooldown > 0) {
                  const hours = Math.floor(remainingCooldown / 3600);
                  const minutes = Math.floor((remainingCooldown % 3600) / 60);
                  const seconds = Math.floor(remainingCooldown % 60);
          
                  const CouldownEmbed = new Discord.EmbedBuilder()
                  .setDescription(`🕐 Vous avez déjà \`gift\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
                  .setFooter({ text: config.footerText})
                  .setColor(data.color)
          
                  return i.reply({ embeds: [CouldownEmbed] });
              }
            }
          await i.deferUpdate()
          let gain = between(minimum, maximum)
          let btn1 = between(minimum, maximum)
          let btn2 = between(minimum, maximum)
          let btn3 = between(minimum, maximum)
          if (gain > 0) {
              await bot.functions.addCoins(bot, message, args, message.author.id, gain, 'coins')
              let embed = new Discord.EmbedBuilder()
                  .setColor("Green")
                  .setDescription(`:gift: **Vous venez de gagner \`${gain} coins\` !**`)
                  .addFields(
                      { name: 'Carte 1', value: parseInt(i.customId) === 1 ? `\`${gain} coins\`` : `\`${btn1} coins\`` },
                      { name: 'Carte 2', value: parseInt(i.customId) === 2 ? `\`${gain} coins\`` : `\`${btn2} coins\`` },
                      { name: 'Carte 3', value: parseInt(i.customId) === 3 ? `\`${gain} coins\`` : `\`${btn3} coins\`` },
                  )
                  .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
              msg.edit({ embeds: [embed], components: [] }).catch()
              cooldownsdaily.set(message.author.id, Math.floor(Date.now() / 1000));
              return bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de gagner \`\`${gain} coins\`\``, 'gift', 'Green')
          } else if (gain < 0) {
            await bot.functions.removeCoins(bot, message, args, message.author.id, -gain, 'coins')
              let embed = new Discord.EmbedBuilder()
                  .setColor("Red")
                  .setDescription(`:gift: **Vous venez de perdre \`${gain} coins\` !**`)
                  .addFields(
                      { name: 'Carte 1', value: parseInt(i.customId) === 1 ? `\`${gain} coins\`` : `\`${btn1} coins\`` },
                      { name: 'Carte 2', value: parseInt(i.customId) === 2 ? `\`${gain} coins\`` : `\`${btn2} coins\`` },
                      { name: 'Carte 3', value: parseInt(i.customId) === 3 ? `\`${gain} coins\`` : `\`${btn3} coins\`` },
                  )
                  .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
              msg.edit({ embeds: [embed], components: [] }).catch()
              cooldownsdaily.set(message.author.id, Math.floor(Date.now() / 1000));
              return bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de perdre \`\`${gain} coins\`\``, 'gift', 'Red')
          } else {
              let embed = new Discord.EmbedBuilder()
                  .setColor("DarkButNotBlack")
                  .setDescription(`:gift: **Vous venez de tomber sur 0 !**`)
                  .addFields(
                      { name: 'Carte 1', value: parseInt(i.customId) === 1 ? `\`${gain} coins\`` : `\`${btn1} coins\`` },
                      { name: 'Carte 2', value: parseInt(i.customId) === 2 ? `\`${gain} coins\`` : `\`${btn2} coins\`` },
                      { name: 'Carte 3', value: parseInt(i.customId) === 3 ? `\`${gain} coins\`` : `\`${btn3} coins\`` },
                  )
                  .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
              msg.edit({ embeds: [embed], components: [] }).catch()
              cooldownsdaily.set(message.author.id, Math.floor(Date.now() / 1000));
              return bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de faire 0`, 'gift', 'DarkButNotBlack')
          }

      })
  })


}

function between(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(
      Math.random() * (max - min + 1) + min
  )
}