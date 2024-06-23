const Discord = require('discord.js');

const cooldownsReputation = new Map();

exports.help = {
  name: 'hack',
  aliases: [],
  description: 'Commande du métier hacker',
  use: 'Pas d\'utilisation conseillée',
  category: 'Metier'
}
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).hack;
    let memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
    if (memberDB.metier === "hacker") {
        if (cooldownsReputation.has(message.author.id)) {
            const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
            const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);
    
            if (remainingCooldown > 0) {
                const hours = Math.floor(remainingCooldown / 3600);
                const minutes = Math.floor((remainingCooldown % 3600) / 60);
                const seconds = Math.floor(remainingCooldown % 60);
    
                const CouldownEmbed = new Discord.EmbedBuilder()
                .setDescription(`🕐 Vous avez déjà \`braquage\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setColor(data.color)
    
                return message.reply({ embeds: [CouldownEmbed] });
            }
        }
        if (!args[0]) return message.reply({ content: ":x: `ERROR:` Veuillez préciser l'ID d'une team !", allowedMentions: { repliedUser: false } })
        let authorteam = bot.functions.checkTeam(bot, message, args, args[0])
        if (!authorteam?.id) return message.channel.send(`:x: Pas de team trouvé avec le nom \`${args[0]}\` !`.replaceAll("@", "a"))

        let finallb = JSON.parse(authorteam.members)
        const memberData = finallb.find(({ user }) => user === message.author.id);
        if (memberData) return message.reply(`:x: Vous ne pouvez pas hack votre team !`)

        let moneyEmbed2 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:x: La team \`${authorteam.id}\` n'a plus de cadenas !`)
            .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` });

        if (parseInt(authorteam.cadenas) <= 0) return message.channel.send({ embeds: [moneyEmbed2] })

        const checkif = between(1, 2)
        cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
        if (checkif === 2) {
            return message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:bank: Vous n'avez pas réussi à hack la team \`${authorteam.id}\` !`)
                    .setImage('https://media.discordapp.net/attachments/1249042420163674153/1250163598974779442/giphy-downsized-large.gif?ex=6669f114&is=66689f94&hm=03087b7b7c081de01b4f3cdeb3e048738c74a439b1111f8d662fff0cd423348e&=&width=863&height=485')
                    .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
            })
        }


        let embed = new Discord.EmbedBuilder()
            .setDescription(`:white_check_mark: Vous avez hack la team \`${authorteam.id}\` !`)
            .setColor(data.color)
            .setImage('https://media.discordapp.net/attachments/1249042420163674153/1250163430711754962/EPIC_HACK.gif?ex=6669f0ec&is=66689f6c&hm=524c8069adfa96f1e8c946e48dec4f5807b0f039d21751d09006c83e6a0a17dd&=&width=1864&height=932')
            .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` });
        message.channel.send({ embeds: [embed] })
        bot.db.prepare(`UPDATE team SET cadenas = @coins WHERE id = @id`).run({ coins: authorteam.cadenas - 1, id: args[0] });

    } else {
        return message.channel.send({
            embeds: [new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: Vous devez être **hacker** pour utiliser cette commande !`)]
        })
    }
}

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
} 