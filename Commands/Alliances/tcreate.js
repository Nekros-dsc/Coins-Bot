const Discord = require('discord.js');

exports.help = {
  name: 'tcreate',
  aliases: ['t-create'],
  description: 'Permet de créer une team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let teamprice = JSON.parse(data.gain).team
    let Embed2 = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setDescription(`:x: Vous avez besoin de ${teamprice} pour créer une **team**`);
    let author = JSON.parse(bot.functions.checkUser(bot, message, args, message.author.id).coins).coins
    if (author < teamprice) return message.channel.send({ embeds: [Embed2] })


    if (!bot.functions.checkUserTeam(bot, message, args, message.author.id)) {
      let msgfilter = m => m.author.id == message.author.id;


      let teamid
      let name = null
      let desc = null
      message.channel.send(`:eyes: Veuillez entrer le **nom** de la team:\n(_Tapez \`cancel\` pour annuler l'action en cours_)`)
      await message.channel.awaitMessages({ filter: msgfilter, max: 1, time: 40000, errors: ['time'] })
        .then(cld => {
          var msg = cld.first();
          name = msg.content.replaceAll("@", "a")
        })
      teamid = await removeNonLetters(name)
      if (name.length >= 25) return message.channel.send(`:x: Le nom peut contenir 25 caractères maximum: action annulée`)
      if (teamid.length < 2) return message.channel.send(`:x: Nom de team invalide: action annulée`)
      let uwu = bot.functions.checkTeam(bot, message, args, teamid)
      if (uwu) return message.channel.send(`:x: Ce nom de team est déjà prit !`)

      if (name === "cancel" || name === "Cancel") {
        return message.channel.send(`:x: Action annulée`)
      }
      message.channel.send(`:eyes: Veuillez entrer la **description** de la team:\n(_Tapez \`cancel\` pour annuler l'action en cours_)`)
      await message.channel.awaitMessages({ filter: msgfilter, max: 1, time: 100000, errors: ['time'] })
        .then(cld => {
          var msg = cld.first();
          if (msg.content === "cancel" || msg.content === "Cancel") {
            return message.channel.send(`:x: Action annulée`)
          }
          desc = msg.content.replaceAll("@", "a")
        })
      if (desc.length > 100) {

        return message.channel.send(`:x: La description peut contenir 100 caractères maximum: action annulée`)
      }
      if (!desc || !name) return message.channel.send(`:x: Erreur dans la description et le nom de la team: action annulée`)

        bot.functions.removeCoins(bot, message, args, message.author.id, teamprice, 'coins')
        bot.db.prepare(`INSERT INTO team (id, description, members, name) VALUES (@id, @desc, @array, @name)`).run({ id: teamid, desc: desc, array: `[{ "user": "${message.author.id}", "rank": "1" }]`, name: name });
        bot.db.prepare(`UPDATE user SET team = @coins WHERE id = @id`).run({ coins: teamid, id: message.author.id});

      let embed = new Discord.EmbedBuilder()
        .setTitle("Team créée !")
        .setDescription(`Nom: ${name}
          ID: ${teamid}
          Description: ${desc}
          Leader: <@${message.author.id}>
          Date de création: <t:${Date.parse(new Date) / 1000}>`)
        .setColor(data.color)

      return message.reply({ embeds: [embed] });

    } else { return message.channel.send(`:x: Vous appartenez déjà à une team !`) }
}

function removeNonLetters(text) {
    return (text.replace(/[^A-Za-z]/g, '')).toLowerCase()
}