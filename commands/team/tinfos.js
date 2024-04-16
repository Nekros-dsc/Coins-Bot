const Discord = require("discord.js");
const userTeam = require("../../base/functions/teams/userTeam");

module.exports = {
  name: "tinfos",
  description: "Affiche les informations de la team",
  aliases: ['teaminfo', 'teaminfos', 'team'],
  cooldown: 2,

  run: async (client, message, args, data) => {
    let authorteam = ""

    if (!isNaN(args[0]) || message.mentions.members.first() || !args[0]) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      if (!member) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
      authorteam = await userTeam(member.id, message.guild.id)
    } else authorteam = await userTeam(false, message.guild.id, args[0])

    if (!authorteam) return message.channel.send(`:x: Team introuvable !`)
    let rep = authorteam.rep

    let logo = authorteam.logo
    if (logo && !logo.toLowerCase().startsWith("http")) logo = ""

    let banner = authorteam.banner

    if (banner && !banner.toLowerCase().startsWith("http")) banner = " "
    const parsedData = JSON.parse(authorteam.members)

    let finallb = Object.entries(parsedData).sort((a, b) => a[1].rank - b[1].rank).map(([id, { rank }]) => {
      return (`**${`${rank}`.replace("1", "Créateur").replace("2", "Officier").replace("3", "Membre")}** | <@${id}>`);
    });

    let cadenas = authorteam.cadenas
    if (cadenas <= 0) {
      cadenas = "\`\`\`Aucun cadenas\`\`\`";
    } else {
      cadenas = `\`\`\`${"🔒".repeat(cadenas)}\`\`\``
    }

    let next = " "
    let logprice = (data.guild.Prices)["logoprice"] || 10
    let bannerprice = (data.guild.Prices)["bannerprice"] || 20
    if (rep < logprice) {
      next = `Il manque ${logprice - parseInt(rep)} reputation de team pour débloquer le logo`
    }
    if (rep >= logprice && rep < bannerprice) {
      next = `Il manque ${bannerprice - parseInt(rep)} reputation de team pour débloquer la bannière`
    }
    if (rep >= bannerprice) {
      next = `Tous les attributs de team ont été débloqués !`
    }
    let impots = (data.guild.Prices)["impotsprice"] || 10
    const embed = new Discord.EmbedBuilder()
      .setAuthor({ name: `Informations de la team ${authorteam.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setDescription(`**Nom:** ${authorteam.name}\n **Description:** ${authorteam.desc}\n **Argent:** \`${authorteam.coins} coins\`\n **Réputation:** \`${authorteam.rep} rep\`\n **Impôt/Jour:** \`${impots * finallb.length * 6} coins\`\n **ID:** ${authorteam.teamid}\n\n${cadenas}\n\n __Membres (${finallb.length}) :__\n` + finallb.join("\n"))
      .setFooter({ text: next })
      .setColor(data.color)
    if (rep >= bannerprice && banner) embed.setImage(banner)
    if (rep >= logprice && logo) embed.setThumbnail(logo)
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(e => { console.log(e) })


  }

};