const Discord = require('discord.js');
var rslow = require('../../Utils/function/roulette.js')
let beforewar = 5000

const cooldownsReputation = new Map();

exports.help = {
  name: 'tattack',
  aliases: ['tatt'],
  description: 'Permets de d\'attaquer une team adverse afin de casser un cadenas',
  use: 'tattack <teamid> <troupes>',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).tattack;
    let authorteam = bot.functions.checkUserTeam(bot, message, args, message.author.id)
    if (!JSON.parse(authorteam.coins).rep || parseInt(JSON.parse(authorteam.coins).rep) < 5) return message.channel.send(`:military_helmet: Vous devez avoir au moins 5 réputations de team pour débloquer l'armée !`)
if (cooldownsReputation.has(message.author.id)) {
        const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
        const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);

        if (remainingCooldown > 0) {
            const hours = Math.floor(remainingCooldown / 3600);
            const minutes = Math.floor((remainingCooldown % 3600) / 60);
            const seconds = Math.floor(remainingCooldown % 60);

            const CouldownEmbed = new Discord.EmbedBuilder()
            .setDescription(`:x: Vous avez déjà \`tattack\` quelqu'un\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor(data.color)

            return message.reply({ embeds: [CouldownEmbed] });
        }
    }
    if (!isNaN(args[0]) || message.mentions.members.first() || !args[0]) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
        targetteam = bot.functions.checkUserTeam(bot, message, args, message.author.id)
    } else targetteam = bot.functions.checkTeam(bot, message, args, args[0])
    if (!targetteam) return message.channel.send(`:x: Vous n'avez pas de team !`)
    if (rslow.allattacks[message.guild.id, "-", authorteam.id]) return message.reply(`:x: Vous êtes déjà en guerre (vous ne pouvez pas modifier les troupes envoyées)`)
    if (!(await setCooldown(message, data.color, message.member.id, message.guild.id, "tattack", 3600000, true))) return


    let finallb = JSON.parse(authorteam.members)
    const memberData = finallb.find(({ user }) => user === member.id);
    if (parseInt(memberData.rank) >= 2) return message.channel.send(`:warning: Vous devez être \`Créateur\` de la team pour attaquer!`)

    if (authorteam.id == targetteam.id) return message.reply(":x: Vous ne pouvez pas attaquer votre propre team !")
    if (!args[1] || !verifnum(args[1])) return message.reply(":x: Vous devez préciser le nombre de soldats valide que vous envoyez !")

    if (!authorteam.army || parseInt(authorteam.army) <= 0) return message.reply(":x: Vous n'avez pas d'armée !\nVeuillez faire la comsgande \`tarmy\` pour agrandir votre armée !")
    if (parseInt(authorteam.army) < args[1]) return message.reply(":x: Vous n'avez pas autant de troupes !")

    let logs = JSON.parse(data.logs).war
    logs = message.guild.channels.cache.get(logs)
    if (!logs) return message.reply(":x: Le salon de logs n'a pas été défini par les administrateurs !\n_Psst:_ \`setlogs war <#channel>\`")

        cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
    const embed = new Discord.EmbedBuilder()
        .setTitle(`Ralliement contre la team ${targetteam.name}`)
        .setDescription(`L'attaque partira dans <t:${parseInt((Date.now() + beforewar) / 1000)}:R>\n`)
        .addFields([{ name: "Troupes:", value: `\`\`\`js\n${args[1]}\`\`\`` }])
        .setColor(data.color)
    logs.send({ embeds: [embed] }).catch(e => console.log(e)).then(async msg => {
        message.reply(`:military_helmet: L'attaque a bien été lancée !\n${logs}`)
        rslow.allattacks[message.guild.id, "-", authorteam.id] = true
        rslow.allattacks[message.guild.id, "-", targetteam.id] = true
        setTimeout(async () => {
            
                msg.edit({ content: ":crossed_swords: Attaque en cours" })
                let victory = true
                let aaaaa = parseInt(args[1])
                let bbbbb = parseInt(targetteam.army)
                let troupes_attaque = { alive: aaaaa || 0, blesses: 0 }
                let troupes_defense = { alive: bbbbb || 0, blesses: 0 }
                while (troupes_attaque.alive > 0 && troupes_defense.alive > 0) {
                    let lifeordeath = between(1, 2)
                    //si la defense survie
                    if (lifeordeath == 1) {
                        troupes_attaque.alive--;
                        let blesseordeath = between(1, 3)
                        if (blesseordeath !== 1) troupes_attaque.blesses++
                    } else {
                        troupes_defense.alive--;
                        let blesseordeath = between(1, 3)
                        if (blesseordeath !== 1) troupes_defense.blesses++
                    }
                    if (troupes_attaque.alive > troupes_defense.alive) { victory = true } else { victory = false }
                }
                const embed = new Discord.EmbedBuilder()
                    .setTitle(`Ralliement contre la team ${targetteam.name}`)
                    .addFields([{ name: "Équipe attaque", value: `Survivant${troupes_attaque.alive > 1 ? "s" : ""}: _${troupes_attaque.alive || 0}_\nBlessé${troupes_attaque.blesses > 1 ? "s" : ""}: _${troupes_attaque.blesses}_\nMort${aaaaa - troupes_attaque.alive - troupes_attaque.blesses > 1 ? "s" : ""}: _${aaaaa - troupes_attaque.alive - troupes_attaque.blesses}_` },
                    { name: "Équipe défense", value: `Survivant${troupes_defense.alive > 1 ? "s" : ""}: _${troupes_defense.alive || 0}_\nBlessé${troupes_defense.blesses > 1 ? "s" : ""}: _${troupes_defense.blesses}_\nMort${bbbbb - troupes_defense.alive - troupes_defense.blesses > 1 ? "s" : ""}: _${bbbbb - troupes_defense.alive - troupes_defense.blesses}_` }])
                targetteam = bot.functions.checkTeam(bot, message, args, targetteam.id)
                bot.db.prepare(`UPDATE team SET army = @coins WHERE id = @id`).run({ coins: troupes_defense.alive, id: targetteam.id});
                bot.db.prepare(`UPDATE team SET blesses = @coins WHERE id = @id`).run({ coins: targetteam.blesses + troupes_defense.blesses, id: targetteam.id});

                authorteam = bot.functions.checkTeam(bot, message, args, authorteam.id)
                let attaalive = (parseInt(authorteam.army) - parseInt(args[1])) + parseInt(troupes_attaque.alive)
                bot.db.prepare(`UPDATE team SET army = @coins WHERE id = @id`).run({ coins: attaalive, id: authorteam.id});
                bot.db.prepare(`UPDATE team SET blesses = @coins WHERE id = @id`).run({ coins: targetteam.blesses + troupes_attaque.blesses, id: authorteam.id});

                if (victory == true) {
                    embed.setColor("00E71C")
                    let cad = parseInt(targetteam.cadenas) || 0
                    msg.edit({ content: `**Victoire contre la team ${targetteam.name} !**\n${cad <= 1 ? "Vous ne pouvez pas casser le dernier \`🔒\` avec une attaque ! Vous devez être \`hacker\` !" : `Elle perd \`1 🔒\` !`}`, embeds: [embed] })
                    if (cad > 1) bot.functions.removeTeam(bot, message, args, targetteam.id, 1, "cadenas")
                } else {
                    embed.setColor("E70000")
                    msg.edit({ content: `**Défaite contre la team ${targetteam.name} !**`, embeds: [embed] })
                }
                delete rslow.allattacks[message.guild.id, "-", authorteam.id]
                delete rslow.allattacks[message.guild.id, "-", targetteam.id]
        }, beforewar)
    })
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}