const Discord = require("discord.js");
const setCooldown = require("../../base/functions/setCooldown");
const { between } = require("../../base/functions");
const addMinerais = require("../../base/functions/addMinerais");
const getUser = require("../../base/functions/getUser");

module.exports = {
  name: "mine",
  description: "Mine des minerais",

  run: async (client, message, args, data) => {
    const user = await getUser(message.member.user.id, message.guild.id);
    const mineData = JSON.parse(user.Minerais) || {}
    if (!mineData.wagon) {
      const nowEmbed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setFooter({
          text: message.member.user.username,
          iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(":x: Vous devez acheter un wagon avant de pouvoir utiliser cette commande !\nExemple: `buy wagon`");
      return message.reply({ embeds: [nowEmbed], allowedMentions: { repliedUser: false } });
    }

    let cool = await setCooldown(message, data.color, message.author.id, message.guild.id, "mine", 3600000, false, true)
    if (!cool[0] && cool !== true && cool.length) {
      const timeEmbed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setThumbnail("https://cdn.discordapp.com/attachments/902802602306183168/903178967446593556/pioche-removebg-preview.png")
        .setDescription(`:x: Vous avez déjà miné récemment\n\nRéessayez dans ${cool[1]}\nUtilisez la commande \`wagon\` pour vendre vos minerais\n\n**__Inventaire:__**\n**Charbon:** ${mineData.charbon || 0}\n**Fer:** ${mineData.fer || 0}\n**Or:** ${mineData.or || 0}\n**Diamant:** ${mineData.diamant || 0}`)
        .setFooter({
          text: message.member.user.username,
          iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
        });
      return message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false } });
    }

    const randomnumber = between(0, 9);
    const minerais = randomnumber <= 3 ? "charbon" : randomnumber <= 5 || randomnumber === 8 ? "fer" : randomnumber <= 7 ? "or" : "diamant";

    const numb = between(1, 2);
    await addMinerais(message.author.id, message.guild.id, minerais, numb, true)

    const embed5 = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setThumbnail("https://cdn.discordapp.com/attachments/902802602306183168/903178967446593556/pioche-removebg-preview.png")
      .setDescription(`:pick: ${message.author.tag}, Vous venez de gagner \`${numb} ${minerais}(s)\`\nUtilisez la commande \`wagon\` pour vendre vos minerais !`)
      .setFooter({
        text: message.member.user.username,
        iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
      });

    message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } });
    const values = await addMinerais(message.author.id, message.guild.id, "wagon", 1, false)

    if (values.wagon <= 0) {
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

  },
};
