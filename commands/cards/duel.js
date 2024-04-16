const Discord = require("discord.js");
const { webhook, between, verifnum, generateCanva } = require("../../base/functions");
var rslow = require('../../roulette.js');
const { Cards } = require("../../base/Database/Models/Cards");
const color = require("../../base/functions/color");
const getUser = require("../../base/functions/getUser");

module.exports = {
  name: "duel",
  description: "Lance un duel de cartes",
  usage: "duel <@user>",
  cooldown: 2,
  aliases: ['cduel'],

  run: async (client, message, args, data) => {
    const opponent = message.mentions.members.first();
    if (!opponent || opponent.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } });

    let mise = args[1];
    let moneymore = new Discord.EmbedBuilder()
      .setColor(data.color) 
      .setDescription(`:x: Vous n'avez pas assez !`);

    if (!mise) return message.channel.send(`:x: Merci de préciser une somme à jouer !`);

    let moneydb = await getUser(message.member.id, message.guild.id)
    if (!verifnum(mise)) return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } });

    if (mise === "all") { mise = parseInt(moneydb.Coins); }
    if (mise > parseInt(moneydb.Coins)) return message.channel.send({ embeds: [moneymore] });

    let amoneydb = await getUser(opponent.user.id, message.guild.id)
    if (parseInt(amoneydb.Coins) < mise) return message.reply({ content: `:x: **${opponent.user.username} n'a pas assez de coins pour jouer avec vous !** Il doit avoir en main la somme misée pour jouer !`, allowedMentions: { repliedUser: false } });

    let actuale = await Cards.findAll({
      where: {
        guildId: message.guild.id
      }
    });

    let propriocards = actuale.find(u => u.proprio === message.member.id);
    if (!propriocards) return message.reply(`:x: Vous n'avez pas de carte pour lancer un duel !`);

    let membercards = actuale.find(u => u.proprio === opponent.id);
    if (!membercards) return message.reply(`:x: ${opponent.user.username} n'a pas de carte pour lancer un duel !`);

    if (message.author.id === opponent.user.id) return message.channel.send('Tu ne peux pas jouer avec toi-même !');

    if (rslow.roulette[message.author.id] === true) {
      setTimeout(() => {
        rslow.roulette[message.author.id] = false;
      }, 20000);
      return message.channel.send(`:x: Vous avez déjà lancé un jeu ! Veuillez attendre la fin de celui-ci !`);
    }

    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('valide')
          .setLabel('✅')
          .setStyle(Discord.ButtonStyle.Success),
      );

    message.channel.send({ content: `:question: <@${opponent.user.id}> (puissance: ${membercards.vie + membercards.defense + membercards.attaque}/150) acceptes-tu le duel de **Card** avec une mise de ${mise} coins contre <@${message.author.id}> (puissance: ${propriocards.vie + propriocards.defense + propriocards.attaque}/150) ?\n\n_Tu as 30 secondes pour accepter_`, components: [row] }).then(async msg => {
      rslow.roulette[message.author.id] = true;

      const collector = msg.createMessageComponentCollector({ time: 35000 });

      collector.on('collect', async (r, user) => {
        if (opponent.user.id !== r.user.id) return r.reply({ content: `C'est ${opponent.user.username} qui doit cliquer ici !`, ephemeral: true });
        await r.deferUpdate();

        if (r.customId === 'valide') {
          const oppodata = await color(opponent.user.id, message.guild.id, client)

          if (rslow.roulette[opponent.user.id] === true) {
            setTimeout(() => {
              rslow.roulette[opponent.user.id] = false;
            }, 20000);
            return message.channel.send(`:x: Vous avez déjà lancé un jeu ! Veuillez attendre la fin de celui-ci !`);
          }

          rslow.roulette[opponent.user.id] = true;

          await moneydb.decrement('Coins', { by: mise });
          await amoneydb.decrement('Coins', { by: mise });

          const positions = {
            three: '👾 :point_right:      **Lancement des dés d\'attaque**        :point_left: 👾',
            two: '🛡️ :point_right:       **Lancement des dés de défense**        :point_left: 🛡️',
            one: ':levitate: :point_right:       **Résultats !**        :point_left: :levitate:',
            ended1: `☠️      **Défaite de ${message.author.username}**        👹`,
            ended2: `👹      **Défaite de ${opponent.user.username}**        ☠️`,
          };

          let result = { author: {}, opponent: {} };
          result.author.vie = propriocards.vie;
          result.opponent.vie = membercards.vie;

          function round() {
            const embed = new Discord.EmbedBuilder();

            setTimeout(() => {
              embed.setTitle(positions.three);
              msg.edit({
                content: " ",
                embeds: [embed],
                components: []
              });

              result.author.attaque = between(1, propriocards.attaque);
              result.opponent.attaque = between(1, membercards.attaque);
            }, 1000);

            setTimeout(() => {
              embed.setTitle(positions.two);
              msg.edit({
                embeds: [embed]
              });

              result.author.defense = between(1, propriocards.defense);
              result.opponent.defense = between(1, membercards.defense);
            }, 4000);

            setTimeout(async () => {
              embed.setTitle(positions.one);

              result.author.vie = result.author.vie + result.author.defense - result.opponent.attaque;
              result.opponent.vie = result.opponent.vie + result.opponent.defense - result.author.attaque;

              embed.addFields([
                { name: `> ${propriocards.name}`, value: `**Attaque:** ${result.author.attaque}\n**Défense:** ${result.author.defense}\n**Vie restante:** ${result.author.vie}` },
                { name: `> ${membercards.name}`, value: `**Attaque:** ${result.opponent.attaque}\n**Défense:** ${result.opponent.defense}\n**Vie restante:** ${result.opponent.vie}`, inline: true }
              ]);

              let attachment;
              if (result.author.vie > result.opponent.vie) {
                embed.setTitle(`🏆 Victoire de ${propriocards.name} (${message.author.username})`);
                attachment = await generateCanva(propriocards, `Victoire de ${propriocards.name}`, data.color);
                embed.setImage("attachment://attach.png");

                await moneydb.increment('Coins', { by: mise * 2 });
                await moneydb.increment('Victoires', { by: 1 });

                if (propriocards.vie > 1) propriocards.vie--;
                if (membercards.vie < 50) membercards.vie++;

                await propriocards.save();
                await membercards.save();
              } else {
                embed.setTitle(`🏆 Victoire de ${membercards.name} (${opponent.user.username})`);
                attachment = await generateCanva(membercards, `Victoire de ${membercards.name}`, oppodata.color);
                embed.setImage("attachment://attach.png");

                await amoneydb.increment('Coins', { by: mise * 2 });
                await amoneydb.increment('Victoires', { by: 1 });

                if (propriocards.vie < 50) propriocards.vie--;
                if (membercards.vie > 1) membercards.vie++;

                await propriocards.save();
                await membercards.save();
              }

              embed.setDescription(`**Gain: ${mise * 2} :coin:**`);

              msg.edit({
                embeds: [embed],
                files: [attachment]
              });

              rslow.roulette[message.author.id] = false;
              rslow.roulette[opponent.user.id] = false;
            }, 6000);
          }

          round();
        }

      })


      collector.on("end", async () => {
        rslow.roulette[message.author.id] = false;
        return msg.edit({ components: [], files: [] }).catch(() => { });
      })
    })
  }
};