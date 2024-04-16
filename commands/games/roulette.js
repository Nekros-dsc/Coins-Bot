const Discord = require("discord.js");
var rslow = require('../../roulette.js');
const { between, wlog, verifnum } = require("../../base/functions");
const removeCoins = require("../../base/functions/removeCoins.js");
const getUser = require("../../base/functions/getUser.js");
const addCoins = require("../../base/functions/addCoins.js");
module.exports = {
  name: "roulette",
  description: "Lance une roulette",
  aliases: ['roll'],

  run: async (client, message, args, data) => {
    let user = message.author;

    function isOdd(num) {
      if ((num % 2) == 0) return false;
      else if ((num % 2) == 1) return true;
    }

    let money = args[0];
    let colour = args[1];
    let moneydb = (await getUser(message.member.id, message.guild.id)).Coins
    let random = Math.floor(Math.random() * 37);
    let moneyhelp = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setDescription(`:x: Précisez un montant à miser | roulette <amount/all> <color/number>`);

    let moneymore = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setDescription(`:x: Vous n'avez pas assez !`);

    let colorbad = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setDescription(`:x: Précisez une couleur | Red [1.5x] Black [2x] Green [12x] **ou** un chiffre`);
    if (!money) return message.channel.send({ embeds: [moneyhelp] });
    if (money === "all") { money = moneydb } else {
      money = parseInt(money)
      if (!verifnum(money)) return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } })
    }
    if (!colour) return message.reply({ embeds: [colorbad], allowedMentions: { repliedUser: false } });
    colour = colour.toLowerCase()
    if (money > moneydb || money < 0) return message.channel.send({ embeds: [moneymore] });
    if (rslow.roulette[message.author.id] == true) {
      setTimeout(() => {
        rslow.roulette[message.author.id] = false;
      }, 20000);
      return message.channel.send(`:x: Vous avez déjà lancé une roulette ! Veuillez attendre la fin de celle-ci !`)
    }
    if (isNaN(colour)) {
      if (money < 50) return message.channel.send({
        embeds: [new Discord.EmbedBuilder()
          .setColor(data.color)
          .setDescription(`:x: Vous devez miser un chiffre supérieur à 50 !`)]
      })
      if (isNaN(money)) return message.channel.send({
        embeds: [new Discord.EmbedBuilder()
          .setColor(data.color)
          .setDescription(`:x: Vous devez miser un chiffre valide !`)]
      })
      if (colour == "b" || colour.includes("black")) colour = 0;
      else if (colour == "r" || colour.includes("red")) colour = 1;
      else if (colour == "g" || colour.includes("green")) colour = 2;
      else return message.channel.send({ embeds: [colorbad] });
      rslow.roulette[message.author.id] = true;
      removeCoins(message.member.id, message.guild.id, money, "coins")
      message.channel.send({
        embeds: [new Discord.EmbedBuilder()
          .setColor(data.color)
          .setDescription(user.username + ` vient de lancer une **roulette** en misant \`${money} coins\` sur \`${args[1]}\` !`)
          .setImage("https://media.discordapp.net/attachments/1170288145871413318/1229716279456305204/roulette.gif?ex=6630b188&is=661e3c88&hm=fdb31c12e275e2a32667c540ca276172640c051853c73e4e0b56715b3ecaac10&=&width=768&height=540")
          .setFooter({ text: `${message.member.user.username} | 10 secondes avant le résultat`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })], allowedMentions: { repliedUser: false }
      })

      setTimeout(() => {
        if (random == 0 && colour == 2) { // Green
          money *= 12
          addCoins(message.member.id, message.guild.id, money, "coins")
          rslow.roulette[message.author.id] = false;
          let moneyEmbed1 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Résultat: Green`)
            .setDescription(`:green_circle: Vous avez gagné \`${money} coins\`\n\Multiplieur: 12x`)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
          message.reply({
            content: `${message.author}`, embeds: [moneyEmbed1]
          })
          wlog(message.author, "GREEN", message.guild, `${message.author.tag} vient de gagner \`\`${money} coins\`\``, "Roulette")
        } else if (isOdd(random) && colour == 1) { // Red
          money = parseInt(money * 1.5)
          addCoins(message.member.id, message.guild.id, money, "coins")
          rslow.roulette[message.author.id] = false;
          let moneyEmbed2 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Résultat: Red`)
            .setDescription(`:red_circle: Vous avez gagné \`${money} coins\`\n\nMultiplieur: 1.5x`)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
          message.reply({
            content: `${message.author}`, embeds: [moneyEmbed2]
          })
          wlog(message.author, "GREEN", message.guild, `${message.author.tag} vient de gagner \`\`${money} coins\`\``, "Roulette")

        } else if (!isOdd(random) && colour == 0) { // Black
          money = parseInt(money * 2)
          addCoins(message.member.id, message.guild.id, money, "coins")
          rslow.roulette[message.author.id] = false;
          let moneyEmbed3 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Résultat: Black`)
            .setDescription(`:black_circle: Vous avez gagné \`${money} coins\`\n\nMultiplieur: 2x`)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
          message.reply({
            content: `${message.author}`, embeds: [moneyEmbed3]
          })
          wlog(message.author, "GREEN", message.guild, `${message.author.tag} vient de gagner \`\`${money} coins\`\``, "Roulette")

        } else { // Wrong
          let moneyEmbed4 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:x: Vous avez perdu \`${money} coins\`\n\nMultiplieur: 0x`)
            .setFooter({
              text: `${message.author.username}`, iconURL: message.author
                .displayAvatarURL({ dynamic: true })
            })
          message.reply({
            content: `${message.author}`, embeds: [moneyEmbed4]
          })
          rslow.roulette[message.author.id] = false;
          wlog(message.author, "RED", message.guild, `${message.author.tag} vient de perdre \`\`${money} coins\`\``, "Roulette")
        }
      }, 20000);
    } else {
      let number = args[1]
      if (number < 0 || number > 37) return message.channel.send({
        embeds: [new Discord.EmbedBuilder()
          .setColor(data.color)
          .setDescription(`:x: Le chiffre doit être compris entre **0** et **37**`)
          .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })], allowedMentions: { repliedUser: false }
      })
      rslow.roulette[message.author.id] = true;
      message.channel.send({
        embeds: [new Discord.EmbedBuilder()
          .setColor(data.color)
          .setDescription(user.username + ` vient de lancer une **roulette** en misant \`${money} coins\` sur \`${args[1]}\` !`)
          .setImage("https://media.discordapp.net/attachments/1170288145871413318/1229716279456305204/roulette.gif?ex=6630b188&is=661e3c88&hm=fdb31c12e275e2a32667c540ca276172640c051853c73e4e0b56715b3ecaac10&=&width=768&height=540")
          .setFooter({ text: `${message.member.user.username} | 20 secondes avant le résultat`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })], allowedMentions: { repliedUser: false }
      })
      removeCoins(message.member.id, message.guild.id, money, "coins")
      let att = setTimeout(() => {
        const roulettenumber = between(0, 37)
        if (roulettenumber === parseInt(number)) {
          let gain = money * 4

          message.reply({
            embeds: [new Discord.EmbedBuilder()
              .setColor(data.color)
              .setTitle("Résultat: " + roulettenumber)
              .setDescription(`:tada: Vous avez misez sur le bon numéro !\nVous venez de gagner \`${gain} coins\``)], allowedMentions: { repliedUser: false }
          })
          addCoins(message.member.id, message.guild.id, gain, "coins")
          wlog(message.author, "GREEN", message.guild, `${message.author.tag} vient de gagner \`\`${gain} coins\`\``, "Roulette number")
          rslow.roulette[message.author.id] = false;
        } else {
          message.reply({
            embeds: [new Discord.EmbedBuilder()
              .setColor("RED")
              .setTitle("Résultat: " + roulettenumber)
              .setDescription(`:name_badge: Vous avez misez sur le mauvais numéro !\nVous venez de perdre \`${money} coins\``)], allowedMentions: { repliedUser: false }
          })
          rslow.roulette[message.author.id] = false;
          wlog(message.author, "RED", message.guild, `${message.author.tag} vient de perdre \`\`${money} coins\`\``, "Roulette number")
        }
      }, 10000);
    }

  }
}