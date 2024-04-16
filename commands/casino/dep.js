const Discord = require("discord.js");
const { verifnum } = require("../../base/functions");
const addCoins = require("../../base/functions/addCoins");
const removeCoins = require("../../base/functions/removeCoins");
const getUser = require("../../base/functions/getUser");

module.exports = {
  name: "dep",
  description: "Dépose votre argent en banque",
  aliases: ['deposit'],

  run: async (client, message, args, data) => {
    client.queue.addJob(async (cb) => {
      const user = message.author;
      const memberDB = await getUser(user.id, message.guild.id);
      const memberCoins = memberDB.Coins;

      if (!args[0]) {

        message.reply({ content: `:x: Merci de préciser un montant à déposer`, allowedMentions: { repliedUser: false } });
      } else if (args[0].toLowerCase() === 'all') {
        if (!verifnum(memberCoins)) {

          message.reply({ content: ":x: Vous n'avez pas d'argent à déposer !", allowedMentions: { repliedUser: false } });
        } else {

          memberDB.increment('Bank', { by: memberCoins });
          memberDB.decrement('Coins', { by: memberCoins });

          let embed5 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:coin: ${message.member.user.tag}, vous avez déposé \`${memberCoins} coins\` dans votre banque !`)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });

          message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } });
        }
      } else {
        if (!verifnum(args[0])) {

          message.reply({ content: `:x: Merci de saisir un montant valide !`, allowedMentions: { repliedUser: false } });
        } else {

          const amountToDeposit = parseInt(args[0]);

          if (memberCoins < amountToDeposit) {
            let embed4 = new Discord.EmbedBuilder()
              .setColor(data.color)
              .setDescription(`:x: Vous n'avez pas assez d'argent pour déposer ${amountToDeposit} coins !`)
              .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
            message.reply({ embeds: [embed4], allowedMentions: { repliedUser: false } });
          } else {

            memberDB.increment('Bank', { by: amountToDeposit });
            memberDB.decrement('Coins', { by: amountToDeposit });

            let embed5 = new Discord.EmbedBuilder()
              .setColor(data.color)
              .setDescription(`:coin: ${message.member.user.tag}, vous avez déposé \`${amountToDeposit} coins\` dans votre banque !`)
              .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });

            message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } });
          }
        }
      }

      cb();
    });
  }
};
