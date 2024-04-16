const Discord = require("discord.js");
const { webhook, msToTime } = require("../../base/functions");
const { parseHuman } = require("human-ms");
var { coq } = require("../../shop.json")
module.exports = {
    name: "mycoq",
    description: "Affiche le panel de votre coq",
    aliases: ['coq'],

    run: async (client, message, args) => {
        return message.reply(":construction_worker: En cours de développement https://discord.gg/uhq")
        const color = db.fetch(`${message.guild.id}_embedcolor_${message.author.id}`)
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let author = db.fetch(`${message.guild.id}_balance_${message.member.id}`)
        let stat = db.fetch(`${message.guild.id}.${member.user.id}.coq.statut`)
        message.reply({ content: "Veuillez patienter..." }).then(async msg => {
            if (args[0] && member.id !== message.author.id) {
                return update(msg, false)
            } else {


                await update(msg, true)
                const collector = msg.createMessageComponentCollector({
                    componentType: Discord.ComponentType.SelectMenu,
                    time: 120000
                })

                collector.on("collect", async (select) => {
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    const value = select.values[0]
                    await select.deferUpdate()
                    author = db.fetch(`${message.guild.id}_balance_${message.member.id}`)
                    if (value == 'heal') {
                        let healtgive = coq.food.healtgive
                        let actual = db.fetch(`${message.guild.id}.${member.user.id}.coq.hp.actual`)
                        let max = db.fetch(`${message.guild.id}.${member.user.id}.coq.hp.max`)
                        if (actual >= max) { update(msg, true); return select.followUp({ content: ":heart: La vie de votre coq est déjà au maximum !", ephemeral: true }); }
                        let verif = max - actual
                        if (verif > 20) { verif = 20; healtgive = healtgive * verif } else healtgive = verif
                        let Embed = new Discord.EmbedBuilder()
                            .setColor(color)
                            .setDescription(`:x: Vous avez besoin de ${coq.food.price * verif} pour nourrir votre coq et soigner ${verif}% !`);
                        if (author < coq.food.price * verif) { update(msg, true); return select.followUp({ embeds: [Embed], ephemeral: true }); }
                        db.add(`${message.guild.id}.${member.user.id}.coq.hp.actual`, coq.food.healtgive * verif)
                        db.subtract(`${message.guild.id}_balance_${message.member.id}`, coq.food.price * verif)
                        select.followUp({ content: `:heart: Votre coq a été soigné de ${verif}% !`, ephemeral: true })
                        update(msg, true)
                    }
                    else if (value == 'shield') {
                        let healtgive = coq.shield.healtgive
                        let actual = db.fetch(`${message.guild.id}.${member.user.id}.coq.shield.actual`)
                        let max = db.fetch(`${message.guild.id}.${member.user.id}.coq.shield.max`)
                        if (actual >= max) { update(msg, true); return select.followUp({ content: ":shield: L'armure est déjà au maximum !", ephemeral: true }); }
                        let verif = max - actual
                        if (verif > 20) { verif = 20; healtgive = healtgive * verif } else healtgive = verif
                        let Embed = new Discord.EmbedBuilder()
                            .setColor(color)
                            .setDescription(`:x: Vous avez besoin de ${coq.shield.price * verif} pour réparer l'armure de ${verif}% !`);
                        if (author < coq.shield.price * verif) { update(msg, true); return select.followUp({ embeds: [Embed], ephemeral: true }); }
                        db.add(`${message.guild.id}.${member.user.id}.coq.shield.actual`, coq.shield.healtgive * verif)
                        db.subtract(`${message.guild.id}_balance_${message.member.id}`, coq.shield.price * verif)
                        select.followUp({ content: `:shield: L'armure a été réparé de ${verif}% !`, ephemeral: true })
                        update(msg, true)
                    } else {
                        select.followUp({ content: `:egg: Votre coq commence son entrainement de ${value} qui se finira <t:${Date.parse(new Date(Date.now() + parseHuman(coq.trains[value].duration))) / 1000}:R> !`, ephemeral: true })
                        db.set(`${message.guild.id}.${member.user.id}.coq.statut.train.start`, Date.now())
                        db.set(`${message.guild.id}.${member.user.id}.coq.statut.train.duration`, parseHuman(coq.trains[value].duration))
                        if (coq.trains[value].attack) db.add(`${message.guild.id}.${member.user.id}.coq.attack`, coq.trains[value].attack)
                        if (coq.trains[value].def) db.add(`${message.guild.id}.${member.user.id}.coq.defense`, coq.trains[value].def)
                        update(msg, true)
                    }
                })

            }
        })
        function update(msg, opt) {
            stat = db.fetch(`${message.guild.id}.${member.user.id}.coq.statut`)
            let pv = db.fetch(`${message.guild.id}.${member.user.id}.coq.hp`)
            let shield = db.fetch(`${message.guild.id}.${member.user.id}.coq.shield`)
            let items = db.fetch(`${message.guild.id}.${member.user.id}.coq.items`)
            let attack = db.fetch(`${message.guild.id}.${member.user.id}.coq.attack`)
            let defense = db.fetch(`${message.guild.id}.${member.user.id}.coq.defense`)

            if (!pv || !pv.actual && pv.actual !== 1) db.set(`${message.guild.id}.${member.user.id}.coq.hp.actual`, 100)
            if (!pv || !pv.max) db.set(`${message.guild.id}.${member.user.id}.coq.hp.max`, 200)
            if (!shield || !shield.actual && shield.actual !== 1) db.set(`${message.guild.id}.${member.user.id}.coq.shield.actual`, 0)
            if (!shield || !shield.max) db.set(`${message.guild.id}.${member.user.id}.coq.shield.max`, 150)
            if (!attack) db.set(`${message.guild.id}.${member.user.id}.coq.attack`, 15)
            if (!defense) db.set(`${message.guild.id}.${member.user.id}.coq.defense`, 5)
            //update
            pv = db.fetch(`${message.guild.id}.${member.user.id}.coq.hp`)
            shield = db.fetch(`${message.guild.id}.${member.user.id}.coq.shield`)
            items = db.fetch(`${message.guild.id}.${member.user.id}.coq.items`)
            attack = db.fetch(`${message.guild.id}.${member.user.id}.coq.attack`)
            defense = db.fetch(`${message.guild.id}.${member.user.id}.coq.defense`)

            hp = Math.round((pv.actual / pv.max) * 100)
            shield = Math.round((shield.actual / shield.max) * 100)

            let thumb = "https://cdn.discordapp.com/attachments/1002173915549937715/1039217610660782230/unknown.png"
            if (stat && stat.train && stat.train.duration) thumb = "https://media.discordapp.net/attachments/1002173915549937715/1039598107966586981/1DA082AD-8E27-4780-92C8-CFA56AD8EC1F.jpg?width=676&height=676"

            let row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('select')
                        .setPlaceholder('S\'occuper du coq')
                        .addOptions([
                            {
                                label: 'Nourrir',
                                description: 'Soigne le coq',
                                value: 'heal',
                                emoji: "🍎"
                            },
                            {
                                label: 'Armure',
                                description: 'Répare l\'armure de votre coq',
                                value: 'shield',
                                emoji: "🛡️"
                            }
                        ]),
                );
            let row2 = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('select2')
                        .setPlaceholder('Améliorer votre coq')
                );
            for (let i in coq.trains) {
                row2.components[0].addOptions([{
                    label: `[TRAIN] ` + i.replace(i[0], i[0].toUpperCase()),
                    description: `${coq.trains[i].duration} | Attaque: +${coq.trains[i].attack ? coq.trains[i].attack : "0"} | Défense: +${coq.trains[i].def ? coq.trains[i].def : "0"}`,
                    value: i
                }]);
            }
            let rowcompo = [row, row2]


            if (stat && stat.train && stat.train.duration) {

                if (stat.train.duration !== null && stat.train.duration - (Date.now() - stat.train.start) > 0) {
                    let button4 = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('train').setLabel(`Fin de l\'entrainement dans ${msToTime(stat.train.duration - (Date.now() - stat.train.start))}`).setDisabled(true)
                    row2 = new Discord.ActionRowBuilder().addComponents([button4])
                    rowcompo = [row2]
                }
            }
            if (!opt) rowcompo = []
            return msg.edit({
                content: " ", embeds: [new Discord.EmbedBuilder()
                    .setTitle("Voici le coq de " + member.user.username + " !")
                    .setThumbnail(thumb)
                    .setDescription(`:heart: **PV:** ${hp || 0}%\n:shield: **Armure:** ${shield || 0}%\n🛠️ **Équipements spéciaux:** ${items && items.length > 0 ? items.map(i => `${i.emoji} : ${i.name} (${i.desc})`) : "Aucun"}
                
                \`\`\`                                                                                                    \`\`\`
                
                :dagger: **Attaque:** ${attack} 
                :boar: **Défense:** ${defense}`)], components: rowcompo
            })

        }

    }
}