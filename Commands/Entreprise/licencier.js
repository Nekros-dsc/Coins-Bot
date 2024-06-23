const Discord = require('discord.js');

exports.help = {
  name: 'licencier',
  aliases: ['lcc'],
  description: 'Licencie un employé dans l\'entreprise',
  use: 'licencier <@member/ID>',
  category: 'Entreprise'
}
exports.run = async (bot, message, args, config, data) => {
    const req = bot.db.prepare('SELECT * FROM entreprise WHERE author = ?').get(message.author.id)
    if(!req) return message.reply(":x: Vous n'avez pas encore d'entreprise, rejoignez-en une ou faites `entreprise` pour créer la votre !")
    const member = message.guild.members.cache.get(message.mentions.members.first()?.id) || message.guild.members.cache.get(args[0]) || message.member
    if (!member || member.user.bot) {
      return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } });
    }

    if(!JSON.parse(req.user).includes(member.id)) return message.reply(`:x: Ce membre ne fait pas parti de votre entreprise !`)
    if(req.author == message.author.id) bot.db.prepare('DELETE FROM entreprise WHERE author = @author').run({ author: message.author.id})
    else JSON.parse(req.user).filter(u => u !== member.id), bot.db.prepare(`UPDATE entreprise SET user = @user WHERE id = @id`).run({ user: JSON.stringify(req.user), id: req.name});

    message.reply(`👋 Vous avez viré **${member}** avec succès !`)
}