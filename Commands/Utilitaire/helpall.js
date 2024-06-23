const Discord = require('discord.js');

exports.help = {
  name: 'helpall',
  aliases: ['help-all'],
  description: 'Affiche l\'ensemble des commandes en une page',
  use: 'Pas d\'utilisation conseillée',
  category: 'Utilitaire'
}
exports.run = async (bot, message, args, config, data) => {
    let gains = JSON.parse(data.gain)
    let voicegain = gains.voicegain
    let streamgain = gains.streamgain
    let camgain = gains.camgain

    const page1 = new Discord.EmbedBuilder()
      .setAuthor({ name: "Page d'aide des commandes", iconURL: "https://media.discordapp.net/attachments/1249042420163674153/1250181494903931001/746614051601252373.png?ex=666a01bf&is=6668b03f&hm=497032e9d771eae49b587f1cd22d3f0f3daceb50b8c87341315005564a8f3f2b&=&format=webp&quality=lossless&width=230&height=230" })
      .setColor(data.color)
      .setDescription(`Prefix du serveur: \`${data.prefix}\`
Utilisez \`${data.prefix}help [commande]\` pour obtenir des informations sur une commande

:coin: **• Gestion des coins :**
coins, profil, top, pay, with, dep, rep
:game_die: **• Jeux**
work, daily, slut, gift, mine, rob
:rocket: **• Mini-jeux**
roulette, blackjack, gunfight, slots, pfc, power4, quetes
:black_joker: **• Cartes**
cards, duel
⌚️ **• Récompenses**
buy, data.color, cshop
:key: **• Job**
job, braquage, kill, juge, cambriolage, hack, arrest, shop, batiment, wagon
⚔️ **• Team**
tcreate, tedit, tbuy, ttop, tinvite, tinfos, tdep, twith, tleave, tkick, tpromote, tdemote, tarmy, tattack, tarmysend, tspy
:pill: **• Illégal**
mobil, recolt
:small_orange_diamond: • Palier
xp
:beginner: **• Administration**
*WHITELIST:* add, remove, setgain, settime, setprice, setxp, setlogs, setmax, setleaderboard, start, drop, course, bingo
*OWNER:* reset, mybot, wl, unwl, block, unblock, tdelete, command, guilds, items, carddrop, update
*ADMINISTRATEUR:* setprefix
:information_source: **• Utilitaire**
help, helpall, vocal, mails, apikey, badges, tutoriel
✋ **• Propriétaires**
owner, unowner, setprofil, leave
 
    
     [\`Support du bot\`](https://discord.gg/7hDfsSZeCK)  |  [\`Lien pour ajouter m'ajouter\`](https://discord.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8) | [\`CoinsBot top.gg\`](https://discord.gg/7hDfsSZeCK)
     \n> Vous gagnez actuellement \`${voicegain} coins\` toutes les 15 minutes lorsque vous êtes en vocal, \`${streamgain} coins\` lorsque vous êtes en stream  et \`${camgain} coins\` lorsque vous activez votre caméra !`)
      .setFooter({ text: config.footerText, iconURL: "https://media.discordapp.net/attachments/1249042420163674153/1250182851584851999/1824_coin.png?ex=666a0303&is=6668b183&hm=7f25f4292d2205ce07b210e823a0deccdaff335ee49affac8e96a43ed2c6796b&=&format=webp&quality=lossless&width=921&height=921" })
      .setImage("https://media.discordapp.net/attachments/1249042420163674153/1250167077378195526/10056.gif?ex=6669f452&is=6668a2d2&hm=435b6f81e5461dc8259ed9a78e8e2245f07fdb48540ad861ab2ef705b8a15cf1&=&width=764&height=35")
      .setTimestamp()

    return message.reply({ embeds: [page1] });
}