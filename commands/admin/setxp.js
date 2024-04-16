const Discord = require('discord.js');

module.exports = {
  name: "setxp",
  description: "Modifie le gain d'xp",
  aliases: ['set-xp'],
  whitelist: true,
  run: async (client, message, args, data) => {
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
      let ActualXP = data.guild.XP
      if (setting.key == "xp") {
        ActualXP[setting.key] = false
      } else
        if (setting.key == "xptrue") {
          delete ActualXP["xp"] 
        } else {
          if (isNaN(args[1]) || args[1] < 0) return message.reply(`:x: Veuillez préciser un gain d'xp valide`)
          ActualXP[setting.key] = Number(args[1]);
        }
      await data.guilds.update({ XP: ActualXP }, { where: { guildId: message.guild.id }});

      const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:small_orange_diamond: ${setting.description.replace("{PARAM}", args[1])}`);

      return message.channel.send({ embeds: [embed] });

    }

    return message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setTitle("Configuration de l'xp")
          .setThumbnail("https://cdn3.emoji.gg/emojis/1171-mc-xp.png")
          .setColor(data.color)
          .setDescription(`
Pour changer le gain d'expérience par message envoyé, utilisez \`setxp msg <xp>\`
Pour changer les gains d'expérience grâce à l'activité vocale toutes les 15 minutes, utilisez \`setxp vocal <xp>\`
Pour désactiver le système d'expérience, utilisez \`setxp off\``)
      ]
    });
  }
};
