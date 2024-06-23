const Discord = require('discord.js');

exports.help = {
  name: 'tinfos',
  aliases: ['teaminfo' , 'teaminfos' , 'team'],
  description: 'Affiche les informations de la team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let authorteam = ""

    if (!isNaN(args[0]) || message.mentions.members.first() || !args[0]) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      if (!member) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
      authorteam = bot.functions.checkUserTeam(bot, message, args, member.id)
    } else authorteam = bot.functions.checkTeam(bot, message, args, args[0])

    if (!authorteam) return message.channel.send(`:x: Team introuvable !`)
    let rep = JSON.parse(authorteam.coins).rep

    let logo = authorteam.logo
    if (logo && !logo.toLowerCase().startsWith("http")) logo = ""

    let banner = authorteam.banner

    if (banner && !banner.toLowerCase().startsWith("http")) banner = " "
    const parsedData = JSON.parse(authorteam.members)

    let finallb = parsedData.sort((a, b) => a.rank - b.rank).map(({ user, rank }) => {
        return `**${rank.replace("1", "Créateur").replace("2", "Officier").replace("3", "Membre")}** | <@${user}>`;
    });

    let cadenas = authorteam.cadenas
    if (cadenas <= 0) {
      cadenas = "\`\`\`Aucun cadenas\`\`\`";
    } else {
      cadenas = `\`\`\`${"🔒".repeat(cadenas)}\`\`\``
    }

    let next = " "
    let logprice = JSON.parse(data.gain).logo
    let bannerprice = JSON.parse(data.gain).banner
    if (rep < logprice) {
      next = `Il manque ${logprice - parseInt(rep)} reputation de team pour débloquer le logo`
    }
    if (rep >= logprice && rep < bannerprice) {
      next = `Il manque ${bannerprice - parseInt(rep)} reputation de team pour débloquer la bannière`
    }
    if (rep >= bannerprice) {
      next = `Tous les attributs de team ont été débloqués !`
    }
    let impots = JSON.parse(data.gain).impots
    const embed = new Discord.EmbedBuilder()
      .setAuthor({ name: `Informations de la team ${authorteam.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setDescription(`**Nom:** ${authorteam.name}\n **Description:** ${authorteam.description}\n **Argent:** \`${JSON.parse(authorteam.coins).coins} coins\`\n **Réputation:** \`${JSON.parse(authorteam.coins).rep} rep\`\n **Impôt/Jour:** \`${impots * finallb.length * 6} coins\`\n **ID:** ${authorteam.id}\n\n${cadenas}\n\n __Membres (${finallb.length}) :__\n` + finallb.join("\n"))
      .setFooter({ text: next })
      .setColor(data.color)
    if (rep >= bannerprice && banner) embed.setImage(banner)
    if (rep >= logprice && logo) embed.setThumbnail(logo)
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(e => { console.log(e) })
}   