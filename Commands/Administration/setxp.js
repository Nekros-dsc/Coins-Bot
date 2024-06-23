const Discord = require('discord.js');

exports.help = {
  name: 'setxp',
  aliases: ['set-xp'],
  description: 'Modifie le gain d\'xp',
  use: 'setxp <msg/vocal/off/on> [gain]',
  category: 'Administration',
  perm: "WHITELIST"
}
exports.run = async (bot, message, args, config, data) => {
    if (args[0]) args[0] = args[0].toLowerCase();

    const settings = {
      msg: {
        key: "msgxp",
        description: "Le gain d'expérience par message a été modifié en {PARAM} !"
      },
      vocal: {
        key: "vocxp",
        description: "Le gain d'expérience par 15min de vocal a été modifié en {PARAM} !"
      },
      off: {
        key: "xp",
        description: "Le système d'expérience vient d'être désactivé !"
      },
      on: {
        key: "xptrue",
        description: "Le système d'expérience vient d'être activé !"
      }
    };

    if (settings[args[0]]) {
      const setting = settings[args[0]];
      let ActualXP = JSON.parse(data.xp)
      if (setting.key == "xp") {
        ActualXP[setting.key] = false
      } else
        if (setting.key == "xptrue") {
          ActualXP["xp"] = true
        } else {
          if (isNaN(args[1]) || args[1] < 0) return message.reply(`:x: Veuillez préciser un gain d'xp valide`)
          ActualXP[setting.key] = Number(args[1]);
        }
        bot.db.prepare(`UPDATE guild SET xp = @coins WHERE id = @id`).run({ coins: JSON.stringify(ActualXP), id: message.guild.id});

      const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:small_orange_diamond: ${setting.description.replace("{PARAM}", args[1])}`);

      return message.channel.send({ embeds: [embed] });

    }

    return message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setTitle("Configuration de l'xp")
          .setThumbnail("https://media.discordapp.net/attachments/1249042420163674153/1250849605529239635/1171-mc-xp.png?ex=666c6ff9&is=666b1e79&hm=66fadd6c8ab48c2f52c33b84dc3eedbc2fdd9050c6bad1a3bc286adf3ba5bd74&=&format=webp&quality=lossless&width=358&height=358")
          .setColor(data.color)
          .setDescription(`
Pour changer le gain d'expérience par message envoyé, utilisez \`setxp msg <xp>\`
Pour changer les gains d'expérience grâce à l'activité vocale toutes les 15 minutes, utilisez \`setxp vocal <xp>\`
Pour désactiver le système d'expérience, utilisez \`setxp off\``)
      ]
    });
}