const Discord = require('discord.js');

exports.help = {
  name: 'recruter',
  aliases: ['rc' , 'recrute' ],
  description: 'Emploie un joueur dans l\'entreprise',
  use: 'recruter <@member/ID>',
  category: 'Entreprise'
}
exports.run = async (bot, message, args, config, data) => {
    let description = ""
    const req = bot.db.prepare('SELECT * FROM entreprise WHERE author = ?').get(message.author.id)
    if(!req) return message.reply(":x: Vous n'avez pas encore d'entreprise, rejoignez-en une ou faites `entreprise` pour créer la votre !")
    if(JSON.parse(req.user).length == 10) return message.reply(`:x: Vous avez atteint le maximum d'ouvriers !`)
    const member = message.guild.members.cache.get(message.mentions.members.first()?.id) || message.guild.members.cache.get(args[0])
    if (!member || member.user.bot) {
      return message.reply({ content: ":x: Vous ne pouvez pas vous inviter vous-même !", allowedMentions: { repliedUser: false } });
    }

    if(bot.db.prepare('SELECT * FROM entreprise WHERE author = ?').get(member.user.id)?.author) description += `**:warning: Vous êtes propriétaire d'une entreprise :warning:**\nSi vous rejoignez l'entreprise ${req.id} votre entreprise actuelle (${bot.db.prepare('SELECT * FROM entreprise WHERE author = ?').get(member.user.id).id}) sera entièrement supprimée !`
 
    const embed = new Discord.EmbedBuilder()
    .setColor(data.color)
    .setDescription(`:question: ${member} acceptes-tu l'invitation dans l'entreprise **${req.id}** ?\n> :information_source: Le salaire est de **${req.salaire} coins / \`work\`** !\n\n*Tu as 30 secondes pour accepter*\n${description}`)
    .setThumbnail('https://media.discordapp.net/attachments/1249042420163674153/1249304093269299292/travail.png?ex=6666d09a&is=66657f1a&hm=470dde928a6df794fb762b2c2ac8ea94cf87eac4f064b62654a0150c790c39ae&=&format=webp&quality=lossless&width=921&height=921')

    const MenuSelect = new Discord.StringSelectMenuBuilder()
    .setCustomId('acceptEntreprise')
    .setDisabled(false)
    .setPlaceholder('Faire une action')
    .addOptions(
        new Discord.StringSelectMenuOptionBuilder()
        .setLabel('Rejoindre')
        .setValue('joinEntreprise')
        .setDescription('Clique ici pour rejoindre l\'entrepise')
    );
    const msg = await message.reply({ embeds: [embed], components: [new Discord.ActionRowBuilder().addComponents(MenuSelect)] })

    const filter = (i) => {
        if(i.user.id == member.id) {
            return true;
        } else {
            return i.reply({ content: `Vous n'avez pas les permissions`, ephemeral: true });
        }
    }
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async (i) => {
        if(i.user.id !== member.id) return;
        const array = JSON.parse(req.user)
        if(!array.includes(i.user.id)) array.push(i.user.id)
        let req2 = bot.db.prepare('SELECT * FROM entreprise WHERE author = ?').get(i.user.id) || bot.db.prepare(`SELECT * FROM entreprise WHERE user LIKE '%${i.user.id}%'`)
        bot.db.exec(`DELETE FROM entreprise WHERE author = '${i.user.id}'`);
        if(req2.author == i.user.id) bot.db.prepare('DELETE FROM entreprise WHERE author = @author').run({ author: i.user.id})
        else if(req2.author) {
            const array2 = JSON.parse(req2.user).filter(u => u !== i.user.id)
            bot.db.prepare(`UPDATE entreprise SET user = @user WHERE id = @id`).run({ user: JSON.stringify(array2), id: req2.id});
        }
        bot.db.prepare(`UPDATE entreprise SET user = @user WHERE id = @id`).run({ user: JSON.stringify(array), id: req.id});
        bot.db.prepare(`UPDATE user SET entrepot = @salaire WHERE id = @id`).run({ salaire: req.id, id: i.user.id })
        i.reply(`# ${i.user.username} a rejoint l'entreprise ${req.id} avec succès !`)
        msg.delete()
    })

    collector.on('end', async () => {
        msg?.edit({ components: [] }).catch(() => false)
    })
}   