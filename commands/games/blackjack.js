const blackjack = require("discord-blackjack-v14");
const Discord = require("discord.js");
const { verifnum } = require("../../base/functions");
const addCoins = require("../../base/functions/addCoins");
const getUser = require("../../base/functions/getUser");
const removeCoins = require("../../base/functions/removeCoins");
var rslow = require('../../roulette.js');
module.exports = {
  name: "blackjack",
  usage: "blackjack <amount>",
  description: "Lance une partie de blackjack",
  aliases: ['bj'],

  run: async (client, message, args, data) => {
    const user = message.author;
    let money = args[0];
    if (rslow.roulette[message.author.id] == true) {
      setTimeout(() => {
        delete rslow.roulette[message.author.id];
      }, 20000);
      return message.channel.send(`:x: Vous avez déjà lancé un jeu ! Veuillez attendre la fin de celui-ci !`)
    }
    const moneydb = (await getUser(user.id, message.guild.id)).Coins
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

    await removeCoins(user.id, message.guild.id, money, "coins");

    const embed = new Discord.EmbedBuilder()
      .setTitle('BlackJack 🎲')
      
      .setColor(data.color)
      .addFields(
        { name: `Votre main`, value: `Cartes: {yourcontent}\nTotal: {yvalue}`, inline: true },
        { name: `Main de ${client.user.username}`, value: `Cartes: {dcontent}\nTotal: {dvalue}`, inline: true }
      )
      .setFooter({ text: `${user.tag}, si vous abandonnez la partie, seulement 50% de vos coins vous seront remboursés !` });

    const game = await blackjack(message, Discord, { normalEmbed: false, normalEmbedContent: embed, resultEmbed: false });
    rslow.roulette[message.author.id] = true
    console.log(game)
    switch (game.result) {
      case 'Win':
        const wingain = parseInt(money * 2);
        await addCoins(user.id, message.guild.id, wingain, "coins");
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Vous avez gagné !")
              .setColor(data.color)
              .setDescription(`Vous avez un total de ${game.yvalue} et moi ${game.dvalue} points !\n:coin: Vous venez de gagner \`${wingain} coins\``)
          ]
        });
        delete rslow.roulette[message.author.id];
        break;
      case 'Tie':
        await addCoins(user.id, message.guild.id, money, "coins");
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Egalité !")
              .setColor(data.color)
              .setDescription(`Nous avons tout les deux ${game.yvalue} points !`)
          ]
        });
        delete rslow.roulette[message.author.id];
        break;
      case 'Lose':
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Vous avez perdu !")
              .setColor(data.color)
              .setDescription(`Vous avez un total de ${game.yvalue} et moi ${game.dvalue} points !\n:coin: Vous venez de perdre \`${money} coins\``)
          ]
        });
        delete rslow.roulette[message.author.id];
        break;
      case 'Double Win':
        const dwingain = parseInt(money * 3);
        await addCoins(user.id, message.guild.id, dwingain, "coins");

        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Double victoire !")
              .setColor(data.color)
              .setDescription(`Vous avez un total de ${game.yvalue} et moi ${game.dvalue} points !\n:coin: Vous venez de gagner \`${dwingain} coins\``)
          ]
        });
        delete rslow.roulette[message.author.id];
        break;
      case 'Double Lose':
        const dlosegain = parseInt(money * 2);
        await removeCoins(user.id, message.guild.id, dlosegain, "coins");
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Double défaite !")
              .setColor(data.color)
              .setDescription(`Vous avez un total de ${game.yvalue} et moi ${game.dvalue} points  !\n:coin: Vous venez de perdre \`${dlosegain} coins\``)
          ]
        });
        break;
      case 'ERROR':
        delete rslow.roulette[message.author.id];
        await addCoins(user.id, message.guild.id, money, "coins");
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("ERREUR !")
              .setColor(data.color)
              .setDescription(`Une erreur est apparue ! Vos coins ont été remboursés !`)
          ]
        });
        break;
      case 'Timeout':
        delete rslow.roulette[message.author.id];
        const timeoutgain = parseInt(money / 2);
        await addCoins(user.id, message.guild.id, timeoutgain, "coins");
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Temps écoulé !")
              .setColor(data.color)
              .setDescription(`Temps écoulé ! 50% de vos coins ont été remboursés !`)
          ]
        });
        break;
      case 'Cancel':
        const abandongain = parseInt(money / 2);
        await addCoins(user.id, message.guild.id, abandongain, "coins");
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
}
