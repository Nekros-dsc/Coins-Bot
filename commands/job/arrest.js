const Discord = require("discord.js");
const getUser = require("../../base/functions/getUser");

module.exports = {
    name: "arrest",
    description: "Commande du métier policier",

    run: async (client, message, args, data) => {
        let memberDB = await getUser(message.member.id, message.guild.id)
        if (memberDB.Metier === "policier") {
            if (memberDB.Capacite === "blanchisseur" || memberDB.Capacite === "cultivateur") {
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
            let targetuser = await getUser(user.id, message.guild.id)
            if (!(await setCooldown(message, data.color, message.member.id, message.guild.id, "arrest", 25200000))) return
            let drugs = targetuser.Drugs
            if (!drugs || drugs <= 0) {
                return message.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`👮 **${user.user.username}** n'est ni blanchisseur et ne possède pas de :pill: !`)
                        .setImage('https://i.pinimg.com/originals/ec/3d/19/ec3d19337b4f134cf066be5586cf86b2.gif')
                        .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
                })
            }
            let gain = drugs * 500
            let usermetier = targetuser.Capacite
            let embed = new Discord.EmbedBuilder()
                .setDescription(`👮 Vous arrêté ${user} qui détenait \`${drugs} 💊\`, vous venez de remporter \`${gain} coins\` !
                            ${usermetier === "blanchisseur" ? `Le joueur était aussi blanchisseur, sa capacité lui a été retiré !` : ""}${usermetier === "cultivateur" ? `Le joueur était aussi cultivateur, sa capacité lui a été retiré !` : ""}`)
                .setColor(data.color)
                .setImage('https://i.pinimg.com/originals/67/04/cd/6704cd2cb66c4a52b2d73c50ff258a4b.gif')
                .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` });
            message.channel.send({ embeds: [embed] })
            memberDB.increment('Coins', { by: gain });
            targetuser.update({ Drugs: null }, { where: { primary: targetuser.primary }});
            if (usermetier === "blanchisseur" || usermetier === "cultivateur") targetuser.update({ Capacite: null }, { where: { primary: targetuser.primary }});

        } else {
            return message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:x: Vous devez être **policier** pour utiliser cette commande !`)]
            })
        }

    }
}