const Discord = require('discord.js');
const blackjack = require("whitehall");
var rslow = require('../../Utils/function/roulette');

exports.help = {
  name: 'blackjack',
  aliases: ['bj'],
  description: 'Lance une partie de blackjack',
  use: 'blackjack <amount>',
  category: 'Jeux'
}
exports.run = async (bot, message, args, config, data) => {
    const user = message.author;
    let money = args[0];
    if (rslow.roulette[message.author.id] == true) {
      setTimeout(() => {
        delete rslow.roulette[message.author.id];
        
      }, 20000);
      return message.channel.send(`:x: Vous avez déjà lancé un jeu ! Veuillez attendre la fin de celui-ci !`)
    }
    const moneydb = JSON.parse(bot.functions.checkUser(bot, message, args, message.author.id).coins).coins
    if (money === "all") {
      money = moneydb;
    } else {
      money = parseInt(money)
      if (!verifnum(money)) {
        return message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(data.color)
              .setDescription(`:x: Précisez un montant valide à miser | blackjack <amount/all>`)
          ],
          allowedMentions: { repliedUser: false }
        });
      }
    }

    money = parseInt(money)
    if (money > moneydb || money <= 0) {
      const moneymore = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous n'avez pas assez !`);
      return message.reply({ embeds: [moneymore], allowedMentions: { repliedUser: false } });
    }

    bot.functions.removeCoins(bot, message, args, message.author.id, money, 'coins')

    let embed = {
      title: "BlackJack 🎲",
      fields: [
          { name: `Votre main`, value: "", inline: true },
          { name: `‎`, value: "‎", inline: true },
          { name: `Main de ${bot.user.username}`, value: "", inline: true }
      ],
      footer: { text: `${message.author.username}, si vous abandonnez la partie, seulement 50% de vos coins vous seront remboursés !`}
  }

    const game = await blackjack(message, {resultEmbed: false, normalEmbed: false, normalEmbedContent: embed});
    rslow.roulette[message.author.id] = true
    switch (game.result) {
      default: 
      delete rslow.roulette[message.author.id];
      bot.functions.addCoins(bot, message, args, message.author.id, money, 'coins')
      message.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("ERREUR !")
            .setColor(data.color)
            .setDescription(`Une erreur est apparue ! Vos coins ont été remboursés !`)
        ]
      });
      
      case 'WIN':
        const wingain = parseInt(money * 2);
        bot.functions.addCoins(bot, message, args, message.author.id, wingain, 'coins')
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Vous avez gagné !")
              .setColor(data.color)
              .setDescription(`Vous avez un total de ${v(game.ycard)} et moi ${v(game.dcard)} points !\n:coin: Vous venez de gagner \`${wingain} coins\``)
          ]
        });
        bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de gagner \`${money}\` coins`, 'bj', 'Green', 'Blackjack')
        delete rslow.roulette[message.author.id];
        break;
      case 'TIE':
        bot.functions.addCoins(bot, message, args, message.author.id, money, 'coins')
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Egalité !")
              .setColor(data.color)
              .setDescription(`Nous avons tout les deux ${v(game.ycard)} points !`)
          ]
        });
        delete rslow.roulette[message.author.id];
        break;
      case 'LOSE':
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Vous avez perdu !")
              .setColor(data.color)
              .setDescription(`Vous avez un total de ${v(game.ycard)} et moi ${v(game.dcard)} points !\n:coin: Vous venez de perdre \`${money} coins\``)
          ]
        });
        bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de perdre \`${money}\` coins`, 'bj', 'Red', 'Blackjack')
        delete rslow.roulette[message.author.id];
        break;
      case 'DOUBLE WIN':
        const dwingain = parseInt(money * 3);
        bot.functions.addCoins(bot, message, args, message.author.id, dwingain, 'coins')

        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Double victoire !")
              .setColor(data.color)
              .setDescription(`Vous avez un total de ${v(game.ycard)} et moi ${v(game.dcard)} points !\n:coin: Vous venez de gagner \`${dwingain} coins\``)
          ]
        });
        bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de gagner \`${money}\` coins`, 'bj', 'Green', 'Blackjack')
        delete rslow.roulette[message.author.id];
        break;
      case 'DOUBLE LOOSE':
        const dlosegain = parseInt(money * 2);
        bot.functions.removeCoins(bot, message, args, message.author.id, dlosegain, 'coins')
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Double défaite !")
              .setColor(data.color)
              .setDescription(`Vous avez un total de ${v(game.ycard)} et moi ${v(game.dcard)} points  !\n:coin: Vous venez de perdre \`${dlosegain} coins\``)
          ]
        });
        bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de perdre \`${money}\` coins`, 'bj', 'Red', 'Blackjack')
        break;
      case 'ERROR':
        delete rslow.roulette[message.author.id];
        bot.functions.addCoins(bot, message, args, message.author.id, money, 'coins')
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("ERREUR !")
              .setColor(data.color)
              .setDescription(`Une erreur est apparue ! Vos coins ont été remboursés !`)
          ]
        });
        break;
      case 'TIMEOUT':
        delete rslow.roulette[message.author.id];
        const timeoutgain = parseInt(money / 2);
        bot.functions.addCoins(bot, message, args, message.author.id, timeoutgain, 'coins')
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Temps écoulé !")
              .setColor(data.color)
              .setDescription(`Temps écoulé ! 50% de vos coins ont été remboursés !`)
          ]
        });
        break;
      case 'CANCEL':
        const abandongain = parseInt(money / 2);
        bot.functions.addCoins(bot, message, args, message.author.id, abandongain, 'coins')
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Abandon !")
              .setColor(data.color)
              .setDescription(`Vous avez abandonné ! La moitié de vos coins vous ont été remboursés !`)
          ]
        });
        delete rslow.roulette[message.author.id];
        break;
    }
    delete rslow.roulette[message.author.id]
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}

function v(cards) {
    return cards.reduce((total, card) => total + card.value, 0);
  }