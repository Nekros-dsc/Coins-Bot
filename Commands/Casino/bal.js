const Discord = require('discord.js');
const numeral = require('numeral');
exports.help = {
  name: 'bal',
  aliases: ['coins' , 'balance' , 'money' , 'bank' , 'coin'],
  description: 'Affiche les coins du membre mentionné ou de l\'auteur du message',
  use: 'coins [@user]',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
  if (!member || member.user.bot) {
    return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } });
  }
  const req = bot.functions.checkUser(bot, message, args, member.id)
  const embed = new Discord.EmbedBuilder()
  .setAuthor({name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true })})
  .setDescription(`> **${member.user.username}** a
  :coin: **${JSON.parse(req.coins).coins > 100000 ? numeral(JSON.parse(req.coins).coins).format('0a') : JSON.parse(req.coins).coins}** coins en poche
  :bank: **${JSON.parse(req.coins).bank > 100000 ? numeral(JSON.parse(req.coins).bank).format('0a') : JSON.parse(req.coins).bank}** coins en banque
  :small_red_triangle: **${JSON.parse(req.coins).rep > 100000 ? numeral(JSON.parse(req.coins).rep).format('0a') : JSON.parse(req.coins).rep}** point${req.rep > 1 ? "s" : ""} de réputation\n`)
  .setColor(data.color)
  .setFooter({ text: config.footerText });

  const embed2 = new Discord.EmbedBuilder()
  .setColor(data.color)
  .setDescription(`[Ajoutez Legacy en cliquant ici !](https://discord.com/oauth2/authorize?client_id=1176633220536729721&permissions=8&scope=bot)\n*Rejoins notre support pour obtenir ta publicité ici !*`)
  .setFooter({ text: 'Publicité'})

  let bouton = new Discord.ButtonBuilder()
  .setLabel('Acheter des coins')
  .setStyle(Discord.ButtonStyle.Link)
  .setURL('https://discord.gg/pbQkyJ9NXj')
  .setEmoji('🚀');

  let bouton2 = new Discord.ButtonBuilder()
  .setLabel('Obtenir un CoinBot Personnalisable')
  .setStyle(Discord.ButtonStyle.Link)
  .setURL('https://discord.gg/pbQkyJ9NXj')
  .setEmoji('✨');

  message.reply({ embeds: [embed, embed2], allowedMentions: { repliedUser: false }, components: [new Discord.ActionRowBuilder().addComponents(bouton, bouton2)] });
}