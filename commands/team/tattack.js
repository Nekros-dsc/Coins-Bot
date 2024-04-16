const Discord = require('discord.js');
const { verifnum, between } = require("../../base/functions");
const setCooldown = require('../../base/functions/setCooldown');
var rslow = require('../../roulette.js');
const userTeam = require('../../base/functions/teams/userTeam');
let beforewar = 5000
//300000
module.exports = {
    name: "tattack",
    description: "Permets de d'attaquer une team adverse afin de casser un cadenas",
    usage: "tattack <teamid> <troupes>",
    aliases: ['tatt'],

    run: async (client, message, args, data) => {

        let authorteam = await userTeam(message.member.id, message.guild.id)
        if (!authorteam.rep || parseInt(authorteam.rep) < 5) return message.channel.send(`:military_helmet: Vous devez avoir au moins 5 réputations de team pour débloquer l'armée !`)

        if (!isNaN(args[0]) || message.mentions.members.first() || !args[0]) {
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!member) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
            targetteam = await userTeam(member.id, message.guild.id)
        } else targetteam = await userTeam(false, message.guild.id, args[0])
        if (!targetteam) return message.channel.send(`:x: Vous n'avez pas de team !`)
        if (rslow.allattacks[message.guild.id, "-", authorteam.teamid]) return message.reply(`:x: Vous êtes déjà en guerre (vous ne pouvez pas modifier les troupes envoyées)`)
        if (!(await setCooldown(message, data.color, message.member.id, message.guild.id, "tattack", 3600000, true))) return


        let finallb = Object.entries(JSON.parse(authorteam.members))
        const memberData = finallb.find(([id]) => id === message.member.id);
        if (parseInt(memberData[1].rank) >= 2) return message.channel.send(`:warning: Vous devez être \`Créateur\` de la team pour attaquer!`)

        if (authorteam.teamid == targetteam.teamid) return message.reply(":x: Vous ne pouvez pas attaquer votre propre team !")
        if (!args[1] || !verifnum(args[1])) return message.reply(":x: Vous devez préciser le nombre de soldats valide que vous envoyez !")

        if (!authorteam.army || parseInt(authorteam.army) <= 0) return message.reply(":x: Vous n'avez pas d'armée !\nVeuillez faire la comsgande \`tarmy\` pour agrandir votre armée !")
        if (parseInt(authorteam.army) < args[1]) return message.reply(":x: Vous n'avez pas autant de troupes !")

        let logs = (data.guild.Logs)["war"]
        logs = message.guild.channels.cache.get(logs)
        if (!logs) return message.reply(":x: Le salon de logs n'a pas été défini par les administrateurs !\n_Psst:_ \`setlogs war <#channel>\`")


        const embed = new Discord.EmbedBuilder()
            .setTitle(`Ralliement contre la team ${targetteam.name}`)
            .setDescription(`L'attaque partira dans <t:${parseInt((Date.now() + beforewar) / 1000)}:R>\n`)
            .addFields([{ name: "Troupes:", value: `\`\`\`js\n${args[1]}\`\`\`` }])
            .setColor(data.color)
        logs.send({ embeds: [embed] }).catch(e => console.log(e)).then(async msg => {
            message.reply(`:military_helmet: L'attaque a bien été lancée !\n${logs}`)
            rslow.allattacks[message.guild.id, "-", authorteam.teamid] = true
            rslow.allattacks[message.guild.id, "-", targetteam.teamid] = true
            if (!(await setCooldown(message, data.color, message.member.id, message.guild.id, "tattack", 3600000))) return
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
                    targetteam = await userTeam(false, message.guild.id, targetteam.teamid)
                    await targetteam.update({ army: troupes_defense.alive }, { where: { teamid: targetteam.teamid, guildId: message.guild.id }})
                    await targetteam.increment('blesses', { by: troupes_defense.blesses });

                    authorteam = await userTeam(false, message.guild.id, authorteam.teamid)
                    let attaalive = (parseInt(authorteam.army) - parseInt(args[1])) + parseInt(troupes_attaque.alive)
                    await authorteam.update({ army: attaalive }, { where: { teamid: targetteam.teamid, guildId: message.guild.id }})
                    await authorteam.increment('blesses', { by: troupes_attaque.blesses });

                    if (victory == true) {
                        embed.setColor("00E71C")
                        let cad = parseInt(targetteam.cadenas) || 0
                        msg.edit({ content: `**Victoire contre la team ${targetteam.name} !**\n${cad <= 1 ? "Vous ne pouvez pas casser le dernier \`🔒\` avec une attaque ! Vous devez être \`hacker\` !" : `Elle perd \`1 🔒\` !`}`, embeds: [embed] })
                        if (cad > 1) targetteam.decrement('cadenas', { by: 1 });
                    } else {
                        embed.setColor("E70000")
                        msg.edit({ content: `**Défaite contre la team ${targetteam.name} !**`, embeds: [embed] })
                    }
                    delete rslow.allattacks[message.guild.id, "-", authorteam.teamid]
                    delete rslow.allattacks[message.guild.id, "-", targetteam.teamid]
            }, beforewar)
        })

    }


}