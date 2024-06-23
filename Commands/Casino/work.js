const Discord = require('discord.js');

const cooldownsReputation = new Map();

exports.help = {
  name: 'work',
  aliases: ['wk'],
  description: 'Fais gagner une somme de coins',
  use: 'Pas d\'utilisation conseillée',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).work;
    let salaire, coinsSalaire = 0
    if (cooldownsReputation.has(message.author.id)) {
        const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
        const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);

        if (remainingCooldown > 0) {
            const hours = Math.floor(remainingCooldown / 3600);
            const minutes = Math.floor((remainingCooldown % 3600) / 60);
            const seconds = Math.floor(remainingCooldown % 60);

            const CouldownEmbed = new Discord.EmbedBuilder()
            .setDescription(`🕐 Vous avez déjà \`work\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor(data.color)

            return message.reply({ embeds: [CouldownEmbed] });
        }
    }

    let minimum = JSON.parse(data.gain).workMin
    let maximum = JSON.parse(data.gain).workMax

    const randomnumber = between(minimum, maximum)
    const req = bot.db.prepare('SELECT * FROM entreprise WHERE id = ?').get(bot.functions.checkUser(bot, message, args, message.author.id).entrepot)
    if(req?.salaire) salaire += `**:moneybag: Salaire de votre entreprise Le dur travail**\nVous remportez \`${req.salaire} coins\` de salaire !`
    if(req?.work == 0) bot.db.prepare(`UPDATE entreprise SET work = @salaire, argent = @argent WHERE author = @id`).run({ salaire: Math.round(10), id: message.author.id, argent: req.argent + req.batiments * 500 - req.batiments * 50 })
    if(req?.argent > req?.salaire) coinsSalaire = req.salaire, bot.db.prepare(`UPDATE entreprise SET work = @salaire, argent = @argent WHERE author = @id`).run({ salaire: Math.round(10), id: message.author.id, argent: req.argent - req.salaire}), bot.db.prepare(`UPDATE entreprise SET work = @salaire WHERE author = @id`).run({ salaire: Math.round(req.work - 1), id: message.author.id })
    bot.functions.addCoins(bot, message, args, message.author.id, randomnumber + coinsSalaire, 'coins')
    let embed5 = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setTitle(`Work`)
      .setDescription(`**${text[Math.floor(Math.random() * 15) + 1].replace('{coinsText}', randomnumber)}${salaire ? `\n\n${salaire}` : "" }**`)
      .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

    message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } })
    cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
    bot.functions.checkLogs(bot, message, args, message.guild.id, randomnumber, 'work')
}
function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

const text = {
    1: "🌈 En tant que bâtisseur de rêves, vous gagnez `{coinsText} coins` pour chaque idée concrétisée. Continuez à construire !",
    2: "🌐 Vous avez été un pilier dans la réalisation de projets complexes. Recevez `{coinsText} coins` pour votre expertise et votre ingéniosité !",
    3: "🏹 En archer exceptionnel, chaque flèche parfaitement tirée vous vaut `{coinsText} coins`. Visez toujours plus haut !",
    4: "🎓 Bravo pour votre persévérance ! Votre dernière étude approfondie vous rapporte `{coinsText} coins` pour votre quête de connaissance !",
    5: "⚙️ Votre talent pour l'ingénierie a encore fait ses preuves. Vous gagnez `{coinsText} coins` pour votre dernière invention brillante !",
    6: "💼 Votre performance exceptionnelle en tant que gestionnaire vous rapporte `{coinsText} coins`. Continuez à exceller dans votre carrière !",
    7: "🎨 En tant qu'artiste talentueux, vous recevez `{coinsText} coins` pour votre dernière œuvre magnifique. Continuez à inspirer !",
    8: "🌟 Votre influence positive dans la communauté vous rapporte `{coinsText} coins`. Continuez à briller et à motiver les autres !",
    9: "📚 En tant que sage érudit, votre dernière découverte vous vaut `{coinsText} coins`. Poursuivez votre voyage de connaissance !",
    10: "🔬 Votre dernière percée scientifique vous rapporte `{coinsText} coins`. Continuez à explorer et à découvrir !",
    11: "🛡️ En tant que protecteur, votre courage et votre bravoure vous valent `{coinsText} coins`. Continuez à défendre la justice !",
    12: "💡 Votre innovation remarquable vous rapporte `{coinsText} coins`. Continuez à transformer des idées en réalité !",
    13: "🏅 Votre dernière victoire éclatante sur le terrain vous rapporte `{coinsText} coins`. Continuez à viser l'excellence !",
    14: "🚀 En tant que pionnier des explorations, votre dernière mission vous rapporte `{coinsText} coins`. Continuez à repousser les limites !",
    15: "🌿 Votre sagesse en matière de guérison naturelle vous rapporte `{coinsText} coins`. Continuez à soigner et à guérir !"
};