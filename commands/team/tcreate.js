const { EmbedBuilder } = require("discord.js");
const { removeNonLetters } = require("../../base/functions");
const Discord = require("discord.js");
const getUser = require("../../base/functions/getUser");
const getTeam = require("../../base/functions/teams/getTeam");
const removeCoins = require("../../base/functions/removeCoins");
const teamAdd = require("../../base/functions/teams/teamAdd");
const userTeam = require("../../base/functions/teams/userTeam");


module.exports = {
  name: "tcreate",
  description: "Permet de créer une team",
  aliases: ['t-create'],
  cooldown: 5,

  run: async (client, message, args, data) => {
    let teamprice = (data.guild.Prices)["teamprice"] || 1000
    let Embed2 = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setDescription(`:x: Vous avez besoin de ${teamprice} pour créer une **team**`);
    let author = (await getUser(message.member.id, message.guild.id)).Coins
    if (author < teamprice) return message.channel.send({ embeds: [Embed2] })


    if (!await userTeam(message.member.id, message.guild.id)) {
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
      let uwu = (await getTeam(teamid, false, message.guild.id, false))
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

      removeCoins(message.member.id, message.guild.id, teamprice, "coins")
      let team = await getTeam(name, desc, message.guild.id)
      teamAdd(message.member.id, team, 1)

      let embed = new EmbedBuilder()
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
};