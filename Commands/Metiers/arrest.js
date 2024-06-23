const Discord = require('discord.js');

const cooldownsReputation = new Map();

exports.help = {
  name: 'arrest',
  aliases: [],
  description: 'Commande du métier policier',
  use: 'Pas d\'utilisation conseillée',
  category: 'Metier'
}
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).arrest;
    if (cooldownsReputation.has(message.author.id)) {
        const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
        const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);

        if (remainingCooldown > 0) {
            const hours = Math.floor(remainingCooldown / 3600);
            const minutes = Math.floor((remainingCooldown % 3600) / 60);
            const seconds = Math.floor(remainingCooldown % 60);

            const CouldownEmbed = new Discord.EmbedBuilder()
            .setDescription(`🕐 Vous avez déjà \`arrest\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor(data.color)

            return message.reply({ embeds: [CouldownEmbed] });
        }
    }
    let memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
    if (memberDB.metier === "policier") {
        if (memberDB.capacite === "blanchisseur" || memberDB.capacite === "cultivateur") {
            message.delete().catch(e => { })
            message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:x: Vous ne pouvez pas utiliser cette commande en ayant votre capacité actuel !`)
                    .setFooter({ text: `Commande Anonyme` })]
            })
        }
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user || user.user.bot || user.id === message.author.id) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
        let targetuser = bot.functions.checkUser(bot, message, args, user.id)
        let drugs = targetuser.drugs
        if (!drugs || drugs <= 0) {
            cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
            return message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`👮 **${user.user.username}** n'est ni blanchisseur et ne possède pas de :pill: !`)
                    .setImage('https://media.discordapp.net/attachments/1249042420163674153/1249799937596719224/ec3d19337b4f134cf066be5586cf86b2.gif?ex=66689e65&is=66674ce5&hm=7cfa68358eced304d533d8b4a721eceef42a921a8053290152edd794120ced5b&=&width=863&height=485')
                    .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
            })
        }
        let gain = drugs * 500
        let usermetier = targetuser.capacite
        let embed = new Discord.EmbedBuilder()
            .setDescription(`👮 Vous arrêté ${user} qui détenait \`${drugs} 💊\`, vous venez de remporter \`${gain} coins\` !
                        ${usermetier === "blanchisseur" ? `Le joueur était aussi blanchisseur, sa capacité lui a été retiré !` : ""}${usermetier === "cultivateur" ? `Le joueur était aussi cultivateur, sa capacité lui a été retiré !` : ""}`)
            .setColor(data.color)
            .setImage('https://images-ext-1.discordapp.net/external/xIezlyuM-VfoQ9GMW89BAke3TknS0n_PZ1b9qgT0Yqw/https/i.pinimg.com/originals/67/04/cd/6704cd2cb66c4a52b2d73c50ff258a4b.gif?width=896&height=502')
            .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` });
            cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
        message.channel.send({ embeds: [embed] })
        bot.functions.addCoins(bot, message, args, message.author.id, gain, 'coins')
        bot.db.prepare(`UPDATE user SET drugs = @coins WHERE id = @id`).run({ coins: 0, id: message.author.id });
        if (usermetier === "blanchisseur" || usermetier === "cultivateur") bot.db.prepare(`UPDATE user SET capacite = @coins WHERE id = @id`).run({ coins: null, id: user.id });

    } else {
        return message.channel.send({
            embeds: [new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: Vous devez être **policier** pour utiliser cette commande !`)]
        })
    }
}   