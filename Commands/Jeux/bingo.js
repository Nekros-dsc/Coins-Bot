const Discord = require('discord.js');
const { parseHuman, parseMS } = require("human-ms");

exports.help = {
  name: 'bingo',
  aliases: [],
  description: 'Lance un bingo',
  use: 'bingo <gain> <durée_avant_lancement> <number_max> [#channel]',
  perm: 'WHITELIST',
  category: 'Jeux'
}
exports.run = async (bot, message, args, config, data) => {
  let arrayTentative = []
  let gain = args[0];
  if (!gain || !verifnum(gain) || gain < 100) return message.channel.send(":clipboard: Pas de gain valide précisée (minimum 100) | Exemple: `bingo 500 5m 100`");
  gain = parseInt(gain)
  let dure = args[1];
  if (!dure || !dure.endsWith("h") && !dure.endsWith("m") || !parseHuman(dure) || parseHuman(dure) > parseHuman("1d")) return message.channel.send(":timer: Merci de préciser un format de temps valide! (m/h) inférieur à 1 jour !)");
  dure = parseHuman(dure);
  let nbMax = args[2]
  if(isNaN(nbMax)) return message.reply(':clipboard: Pas de nombre maximum valide précisé (min: 5 | max: 10000) | Exemple: `bingo 500 5m 100`')
  if(nbMax < 5 || nbMax > 10000) return message.reply(':x: Le nombre de chiffre dans le bingo doit être supérieur à 5')
  if(nbMax > 10000) return message.reply(':x: Le nombre de chiffre dans le bingo doit être inférieur à 10000')
  let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[3]) || message.channel;
  if (!channel && channel !== "none") return message.channel.send(":x: Je ne trouve pas ce salon");

  const numberTOFIND = between(1, nbMax)
  message.channel.send(`*Bingo lancée dans ${channel}*`);

  const embed = new Discord.EmbedBuilder()
  .setColor(data.color)
  .setTitle(`[BINGO] Trouvez le bon nombre !`)
  .setDescription(`Vous avez ${parseMS(dure).replace('and', 'et').replace('hours', 'heures')} pour trouver le bon chiffre\n\n# Le chiffre est compris entre 1 et ${nbMax}`)
  .setImage(`https://media.discordapp.net/attachments/1249042420163674153/1250075920866349148/signe-de-nC3A9on-de-bingo-avec-des-boules-et-des-C3A9toiles-de-loterie.png?ex=66699f6c&is=66684dec&hm=e09345cbcf0c7b2ce39cd2551420671e04b9e4f439a2751cde585640e081f45b&=&format=webp&quality=lossless&width=944&height=629`)
  .setFooter({ text: `Le gagnant remportera ${gain} coins !`})

  const messageDepart = await message.reply({ embeds: [embed]})

  const collector = channel.createMessageCollector({ time: dure });

  collector.on('collect', msg => {
    if(msg.content.includes(numberTOFIND)) return msg.reply(`# __Vous avez trouvé le nombre mystère qui était ${numberTOFIND} !__\n*Tentatives: ${arrayTentative.filter(u => u == msg.author.id).length}*`), bot.functions.addCoins(bot, message, args, msg.author.id, gain, 'coins'), collector.stop('stop')
    else arrayTentative.push(msg.author.id)
  })

  collector.on('end', (collected, reason) => {
        if(reason == "stop") return
        else {
            return messageDepart.reply(`# :x: Personne n'a trouvé le chiffre mystère qui était ${numberTOFIND} !`)
        }
    })  

}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}
function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}