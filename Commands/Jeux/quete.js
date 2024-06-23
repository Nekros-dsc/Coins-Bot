const Discord = require('discord.js');

const cooldownsReputation = new Map();

exports.help = {
  name: 'quete',
  aliases: ['quetes' , 'quest' , 'qt'],
  description: 'Affiche votre quête actuelle !',
  use: 'quete',
  category: 'Jeux'
}
exports.run = async (bot, message, args, config, data) => {
  let json, description;
  const cooldownTime = JSON.parse(data.time).quete;
  if (cooldownsReputation.has(message.author.id)) {
    const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
    const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);

    if (remainingCooldown > 0) {
        const hours = Math.floor(remainingCooldown / 3600);
        const minutes = Math.floor((remainingCooldown % 3600) / 60);
        const seconds = Math.floor(remainingCooldown % 60);

        const CouldownEmbed = new Discord.EmbedBuilder()
        .setDescription(`🕐 Vous avez déjà \`quete\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setColor(data.color)

        return message.reply({ embeds: [CouldownEmbed] });
    }
  }
    const req = bot.functions.checkUser(bot, message, args, message.author.id)
    if(!req.quete) json = genQuete()
    else if(JSON.parse(req.quete).nombre == 0) {
      const embed = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(`Vous avez effectué votre quête avec succès et venez de remporter \`${JSON.parse(req.quete).gain} coins\` !\nRevenez dans 1 heure pour faire la prochaine quête !`)
      .setThumbnail(`https://media.discordapp.net/attachments/1249042420163674153/1250894537904361482/pirate.png?ex=666c99d2&is=666b4852&hm=71bb1bcdeda5f2f907b2f6ad8b0da24f63041f6fd235d82f77e74a8db726d8c6&=&format=webp&quality=lossless&width=404&height=404`)
      .setTitle(`Quêtes de ${message.author.username}`)
      bot.functions.addCoins(bot, message, args, message.author.id, JSON.parse(req.quete).gain, 'coins')
      cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
      bot.db.prepare(`UPDATE user SET quete = @coins WHERE id = @id`).run({ coins: null, id: message.author.id});
      return message.reply({ embeds: [embed] })
  } else json = JSON.parse(req.quete)
      if(json.type == 1) description = `Vous devez encore \`${json.command}\` **${json.nombre} fois** avant de terminer votre quête et remporter **${json.gain} coins** !`
      else if(json.type == 2) description = `Il vous reste **${json.nombre} messages** à envoyer pour terminer votre quête et obtenir **${json.gain} coins** !`
      else if(json.type == 3) description = `Vous devez encore faire **${json.nombre} minutes** de vocal avant de terminer votre quête et gagner **${json.gain} coins** !`
      const embed = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setFooter({ text: config.footerText })
      .setDescription(description)
      .setThumbnail(`https://media.discordapp.net/attachments/1249042420163674153/1250894537904361482/pirate.png?ex=666c99d2&is=666b4852&hm=71bb1bcdeda5f2f907b2f6ad8b0da24f63041f6fd235d82f77e74a8db726d8c6&=&format=webp&quality=lossless&width=404&height=404`)
      .setTitle(`Quêtes de ${message.author.username}`)

      let buttonRenew = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Danger).setCustomId('renewQuete').setLabel("Changer de quête").setEmoji(`<:1068874860169793588:1250903331430203471>`)

      let button_row = new Discord.ActionRowBuilder().addComponents([buttonRenew])

      const msg = await message.reply({ embeds: [embed], components: [button_row]})

      const collector = msg.createMessageComponentCollector({ time: 5 * 60 * 1000 });

      collector.on('collect', async (i) => {
        if(i.user.id !== message.author.id) return i.reply({ content: `Vous n'avez pas les permissions`, ephemeral: true })

        json = genQuete()
        cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
        i.reply({ content: `:white_check_mark: Votre quête a bien été regénérée !\nElle sera de nouveau disponible dans 1 heure`, ephemeral: true }).then(() => msg.delete() )
      })

      function genQuete() {
        const nbQueteGen = between(1, 3)
        if(nbQueteGen == 1) {
          const nbCommand = between(1, 10)
          const commands = bot.commands.filter(command => command.help.category !== 'Administration');
          const nomCommand = Array.from(commands.values())[Math.floor(Math.random() * commands.size)];
          json = {
            "nombre": nbCommand,
            "command": nomCommand.help.name,
            "gain": nbCommand * 60,
            "type": 1
          }
        } else if(nbQueteGen == 2) {
          const nbMessage = between(1, 500)
          json = {
            "nombre": nbMessage,
            "gain": nbMessage * 15,
            "type": 2
          }
        } else if(nbQueteGen == 3) {
          const nbVoc = between(1, 60)
          json = {
            "nombre": nbVoc,
            "gain": nbVoc * 60,
            "type": 3
          }
        }
      
        if(nbQueteGen == 1) description = `Vous devez encore \`${json.command}\` **${json.nombre} fois** avant de terminer votre quête et remporter **${json.gain} coins** !`
        else if(nbQueteGen == 2) description = `Il vous reste **${json.nombre} messages** à envoyer pour terminer votre quête et obtenir **${json.gain} coins** !`
        else if(nbQueteGen == 3) description = `Vous devez encore faire **${json.nombre} minutes** de vocal avant de terminer votre quête et gagner **${json.gain} coins** !`
      
        bot.db.prepare(`UPDATE user SET quete = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
        return json
      }
  }

function between(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(
      Math.random() * (max - min + 1) + min
  )
}
