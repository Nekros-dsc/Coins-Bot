const Discord = require("discord.js");
const { webhook } = require("../../base/functions");

module.exports = {
  name: "info",
  description: "Configuration du serveur",
  aliases: ['infos'],

  run: async (client, message, args, data) => {
    return message.reply(":x: Commande en développement !")
    const color = db.fetch(`${message.guild.id}_embedcolor_${message.author.id}`)

    /////////////////////

    let dminimum = db.fetch(`dmin_${message.guild.id}`)
    if (dminimum === null) dminimum = 50
    let dmaximum = db.fetch(`dmax_${message.guild.id}`)
    if (dmaximum === null) dmaximum = 670

    let wminimum = db.fetch(`wmin_${message.guild.id}`)
    if (wminimum === null) wminimum = 10
    let wmaximum = db.fetch(`wmax_${message.guild.id}`)
    if (wmaximum === null) wmaximum = 400

    let xpmsg = db.fetch(`msgxp_${message.guild.id}`)
    if (xpmsg === null) xpmsg = 5
    let xpvc = db.fetch(`vocxp_${message.guild.id}`)
    if (xpvc === null) xpvc = 10

    let voicegain = db.fetch(`voicegain_${message.guild.id}`)
    let streamgain = db.fetch(`streamgain_${message.guild.id}`)
    if (streamgain === null) streamgain = voicegain
    let camgain = db.fetch(`camgain_${message.guild.id}`)
    if (camgain === null) camgain = voicegain
    let so = db.fetch(`voiceactivity_${message.guild.id}`)
    if (!so) { so = "Désactivé" } else { so = "Activé" }

    let moneyEmbed = new Discord.EmbedBuilder()
      .setColor(color)
      .setTitle(`Paramètres du serveur ${message.guild.name}`)
      .setDescription(`**Work:** \nMaximum: ${wmaximum}\nMinimum: ${wminimum}\n\n**Daily**\nMaximum: ${dmaximum}\nMinimum: ${dminimum}\n\n> Vous gagnez ${voicegain ? voicegain : "rien"} coins toutes les 15 minutes lorsque vous êtes en vocal et ${streamgain ? streamgain : "rien"} lorsque vous êtes en stream et ${camgain ? camgain : "rien"} lorsque vous mettez votre caméra ( ${so} ) \n\nVous gagnez ${xpmsg}xp par message et ${xpvc}xp toutes les 15 minutes en vocal !`)
      .setFooter(`${message.member.user.username}`, `${message.member.user.displayAvatarURL({ dynamic: true })}`);
    message.reply({ embeds: [moneyEmbed] })

  }
};