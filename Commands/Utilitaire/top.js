const Discord = require('discord.js');
const medals = ['🥇', '🥈', '🥉', '4', '5', '6', '7', '8', '9', '10'];

exports.help = {
  name: 'top',
  aliases: ['lb' , 'leaderboard'],
  description: 'Affiche le leaderboard du serveur',
  use: 'Pas d\'utilisation conseillée',
  category: 'Utilitaire'
}
exports.run = async (bot, message, args, config, data) => {
    const row = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Faire une action')
            .addOptions([
                {
                    label: 'Top Total',
                    description: 'Affiche le leaderboard global du serveur (main + banque)',
                    value: 'total'
                },
                {
                    label: 'Top Poche',
                    description: 'Affiche le leaderboard des membres avec de l\'argent en main',
                    value: 'poche'
                },
                {
                    label: 'Top Banque',
                    description: 'Affiche le leaderboard des membres avec de l\'argent en banque',
                    value: 'bank'
                },
                {
                    label: 'Top Reputation',
                    description: 'Affiche le leaderboard des points de réputations des membres',
                    value: 'rep'
                },
                {
                    label: 'Top palier',
                    description: 'Affiche le leaderboard des paliers des membres',
                    value: 'lvl'
                },
            ]),
    );
await message.reply({
    content: '** **',
    allowedMentions: { repliedUser: false }
}).then(async medit => {



    const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `Leaderboard total des coins sur ${message.guild.name}`, iconURL: "https://media.discordapp.net/attachments/1249042420163674153/1250433684721500220/1f911.png?ex=666aec9e&is=66699b1e&hm=ff58c9f200b61ac0e833671620dfdbc6b488d5a88bfef93a0b7d860979d426a0&=&format=webp&quality=lossless&width=921&height=921" })
        .setDescription(await LBtotal(bot, message.guild))
        .setColor(data.color)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });

    medit.edit({ components: [row], embeds: [embed] })

    const collector = medit.createMessageComponentCollector({
        
        time: 60000
    })
    collector.on("collect", async (select) => { 
        if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
        const value = select.values[0]
        await select.deferUpdate()
            if (value == 'poche') {
                await LB(message, medit, "coins")
                select.followUp({ content: 'Voici le top des coins en main !', ephemeral: true })
            } else if (value == 'total') {
                await LB(message, medit, "total")
            } else if (value == 'bank') {
                await LB(message, medit, "bank")
                select.followUp({ content: 'Voici le top des coins en banque !', ephemeral: true })
            } else if (value == 'rep') {
                await LB(message, medit, "rep")
                select.followUp({ content: 'Voici le top des réputations !', ephemeral: true })
            } else if (value == 'lvl') {
                await LB(message, medit, "palier")
                select.followUp({ content: 'Voici le top des paliers !', ephemeral: true })
            }
    });




})

async function LB(message, medit, type) {
    let finalLb
    if (type == "coins") {
        finalLb = await LBmain(bot, message.guild)
    }
    if (type == "bank") {
        finalLb = await LBbank(bot, message.guild)
    }
    if (type == "rep") {
        finalLb = await LBrep(bot, message.guild)
    }
    if (type == "victoires") {
        finalLb = await LBvictoires(bot, message.guild)
    }
    if (type == "palier") {
        finalLb = await LBpalier(bot, message.guild)
    }
    const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `Leaderboard des ${type} sur ${message.guild.name}`, iconURL: "https://media.discordapp.net/attachments/1249042420163674153/1250433684721500220/1f911.png?ex=666aec9e&is=66699b1e&hm=ff58c9f200b61ac0e833671620dfdbc6b488d5a88bfef93a0b7d860979d426a0&=&format=webp&quality=lossless&width=921&height=921" })
        .setDescription(finalLb !== "" ? finalLb : "Aucune donnée")
        .setColor(data.color)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });

    return medit.edit({ content: "** **", embeds: [embed] })

};
}

function LBtotal(bot, guild) {
    let desc = "", count = 0
    const req = bot.db.prepare('SELECT * FROM user').all()
    req.sort((a, b) => (JSON.parse(b.coins).coins + JSON.parse(b.coins).bank) - (JSON.parse(a.coins).coins + JSON.parse(a.coins).bank));
    req.forEach((user, index) => {
        if(JSON.parse(user.coins).bank + JSON.parse(user.coins).coins <= 0) return
        if(count == 9) return
        const user2 = guild.members.cache.get(user.id)
        if(user2) desc += `${medals[index]}) ${user2.user.username}\n\`${JSON.parse(user.coins).bank + JSON.parse(user.coins).coins} coins\` :bank:\n`, count++
    });
    return desc
}

function LBmain(bot, guild) {
    let desc = "", count = 0
    const req = bot.db.prepare('SELECT * FROM user').all()
    req.sort((a, b) => (JSON.parse(b.coins).coins) - (JSON.parse(a.coins).coins));
    req.forEach((user, index) => {
        if(JSON.parse(user.coins).coins <= 0) return 
        if(count == 9) return
        const user2 = guild.members.cache.get(user.id)
        if(user2) desc += `${medals[index]}) ${user2.user.username}\n\`${JSON.parse(user.coins).coins} coins\` :coin:\n`, count++
    });
    return desc
}

function LBbank(bot, guild) {
    let desc = "", count = 0
    const req = bot.db.prepare('SELECT * FROM user').all()
    req.sort((a, b) => (JSON.parse(b.coins).bank) - (JSON.parse(a.coins).bank));
    req.forEach((user, index) => {
        if(JSON.parse(user.coins).bank <= 0) return
        if(count == 9) return
        const user2 = guild.members.cache.get(user.id)
        if(user2) desc += `${medals[index]}) ${user2.user.username}\n\`${JSON.parse(user.coins).bank} coins\` :bank:\n`, count++
    });
    return desc
}

function LBrep(bot, guild) {
    let desc = "", count = 0
    const req = bot.db.prepare('SELECT * FROM user').all()
    req.sort((a, b) => (JSON.parse(b.coins).rep) - (JSON.parse(a.coins).rep));
    req.forEach((user, index) => {
        if(JSON.parse(user.coins).rep <= 0) return
        if(count == 9) return
        const user2 = guild.members.cache.get(user.id)
        if(user2) desc += `${medals[index]}) ${user2.user.username}\n\`${JSON.parse(user.coins).rep} rep\` :small_red_triangle:\n`, count++
    });
    return desc
}

function LBpalier(bot, guild) {
    let desc = "", count = 0
    const req = bot.db.prepare('SELECT * FROM user').all()
    req.sort((a, b) => JSON.parse(b.palier).level - JSON.parse(a.palier).level);
    req.forEach((user, index) => {
        if(JSON.parse(user.palier).level <= 0) return
        if(count == 9) return
        const user2 = guild.members.cache.get(user.id)
        if(user2) desc += `${medals[index]}) ${user2.user.username}\n\`palier ${JSON.parse(user.palier).level}\` :small_orange_diamond:\n`, count++
    });
    return desc
}