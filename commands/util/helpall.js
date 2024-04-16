const discord = require('discord.js')
module.exports = {
  name: "helpall",
  description: "Affiche l'ensemble des commandes en une page",
  aliases: ['help-all'],

  run: async (client, message, args, data) => {

    let gains = data.guild.Gains ||{}
    let voicegain = gains.voicegain || 0
    let streamgain = gains.streamgain || 0
    let camgain = gains.camgain || 0

    const page1 = new discord.EmbedBuilder()
      .setAuthor({ name: "Page d'aide des commandes", iconURL: "https://cdn.discordapp.com/attachments/851876715835293736/852647593020620877/746614051601252373.png" })
      .setColor(data.color)
      .setDescription(`Prefix du serveur: \`${data.guild.Prefix}\`
Utilisez \`${data.guild.Prefix}help [commande]\` pour obtenir des informations sur une commande

     :coin: **• Gestion des coins :**
  coins, profil, top, pay, with, dep, rep
    :game_die: **• Jeux**
  work, daily, slut, gift, mine, rob
    :rocket: **• Mini-jeux**
  roulette, blackjack, gunfight, slots, pfc, power4
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
    :small_orange_diamond: **• Palier**
     xp
    :beginner: **• Administration**
     _WHITELIST:_ add, remove, setgain, settime, setprice, setxp, setlogs, setmax, setleaderboard, start, drop, course
     _OWNER:_ reset, mybot, wl, unwl, block, unblock, tdelete, command, guilds, items, carddrop, update
     _ADMINISTRATEUR:_ setprefix
    :information_source: **• Utilitaire**
  help, helpall, vocal, mails
     ✋ **• Propriétaires**
  owner, unowner, setprofil, leave
 
    
     [\`Support du bot\`](https://discord.gg/uhq)  |  [\`Lien pour ajouter m'ajouter\`](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) | [\`CoinsBot top.gg\`](https://top.gg/bot/874400416731922432)
     \n> Vous gagnez actuellement \`${voicegain} coins\` toutes les 15 minutes lorsque vous êtes en vocal, \`${streamgain} coins\` lorsque vous êtes en stream  et \`${camgain} coins\` lorsque vous activez votre caméra !`)
      .setFooter({ text: "Coins Bot | By Millenium is here#4444 & lowy#1444", iconURL: "https://discordemoji.com/assets/emoji/1824_coin.png" })
      .setImage("https://media.discordapp.net/attachments/1002173915549937715/1128656974859468832/coinsbotbannerr.png")
      .setTimestamp()

    return message.reply({ embeds: [page1] });



  }
}


