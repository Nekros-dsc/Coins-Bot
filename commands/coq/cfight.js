const Discord = require("discord.js");
const { webhook, msToTime, verifnum } = require("../../base/functions");
const { parseHuman } = require("human-ms");
var { coq } = require("../../shop.json")
var rslow = require('../../roulette.js');
module.exports = {
    name: "coqfight",
    description: "Lance un duel de coq",
    aliases: ['cf'],

    run: async (client, message, args) => {
        return message.reply(":construction_worker: En cours de développement https://discord.gg/uhq")
        const color = db.fetch(`${message.guild.id}_embedcolor_${message.author.id}`)
        let member = message.member
        let author = db.fetch(`${message.guild.id}_balance_${message.member.id}`)
        let coq = db.fetch(`${message.guild.id}.${member.user.id}.coq`)
        let life = true
        let stat = db.fetch(`${message.guild.id}.${member.user.id}.coq.statut`)
        if (stat && stat.train && stat.train.duration) {

            if (stat.train.duration !== null && stat.train.duration - (Date.now() - stat.train.start) > 0) return message.reply(":x: Votre coq est en entraînement !")
        }
        const opponent = message.mentions.members.first();
        if (!opponent || opponent.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
        let stat2 = db.fetch(`${message.guild.id}.${opponent.user.id}.coq.statut`)
        if (stat2 && stat2.train && stat2.train.duration) {

            if (stat2.train.duration !== null && stat2.train.duration - (Date.now() - stat2.train.start) > 0) return message.reply(":x: Son coq est en entraînement !")
        }
        let mise = args[1]
        let moneymore = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription(`:x: Vous n'avez pas assez !`);

        let moneydb = await db.fetch(`${message.guild.id}_balance_${message.author.id}`)
        if (!mise) return message.reply({ content: `:x: Merci de préciser un montant à payer`, allowedMentions: { repliedUser: false } })
        if (!verifnum(mise)) return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } })
        if (mise === "all") { mise = moneydb }
        if (mise > moneydb) return message.channel.send({ embeds: [moneymore] });
        let amoneydb = await db.fetch(`${message.guild.id}_balance_${opponent.user.id}`)
        if (amoneydb < mise) return message.reply({ content: `:x: **${opponent.user.username} n'a pas assez de coins pour jouer avec vous !** Il doit avoir en main la somme misée pour jouer !`, allowedMentions: { repliedUser: false } })

        if (message.author.id === opponent.user.id) return message.channel.send('Tu peux pas jouer avec toi même !')
        if (rslow.roulette[message.author.id] == true) {
            setTimeout(() => {
                rslow.roulette[message.author.id] = false;
            }, 20000);
            return message.channel.send(`:x: Vous avez déjà lancé un jeu ! Veuillez attendre la fin de celui-ci !`)
        }
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('valide')
                    .setLabel('✅')
                    .setStyle(Discord.ButtonStyle.Success),
            );
        message.channel.send({ content: `:question: <@${opponent.user.id}> acceptes-tu le duel de **Coq** avec une mise de ${mise} coins contre <@${message.author.id}> ?\n\n_Tu as 30 secondes pour accepter_`, components: [row] }).then(m => {

            const collector = m.createMessageComponentCollector({ time: 60000 });
            collector.on('collect', async (r, user) => {

                if (opponent.user.id !== r.user.id) return r.reply({ content: `C'est ${opponent.user.username} qui doit cliquer ici !`, ephemeral: true })
                await r.deferUpdate();
                if (r.customId === 'valide') {

                    message.channel.send({ content: ":warning: *Combat en cours*", ephemeral: true }).then(async msg => { setTimeout(async () => { await update(msg) }, 10000) })

                }
            })
        })
        function update(msg) {
            let thumb = "https://cdn.discordapp.com/attachments/1002173915549937715/1039217610660782230/unknown.png"
            stat = db.fetch(`${message.guild.id}.${mister.id}.coq.statut`)
            coq = db.fetch(`${message.guild.id}.${mister.id}.coq`)
            msg.edit({
                content: " ", embeds: [new Discord.EmbedBuilder()
                    .setTitle("Le coq gagnant est celui de " + mister.username + " !")
                    .setThumbnail(thumb)
                    .setDescription(`:heart: **PV:** ${coq.hp || 0}%\n:shield: **Armure:** ${coq.shield || 0}%\n🛠️ **Équipements spéciaux:** ${coq.items && coq.items.length > 0 ? coq.items.map(i => `${i.emoji} : ${i.name} (${i.desc})`) : "Aucun"}
                
                        \`\`\`                                                                                                    \`\`\`
                        
                        :dagger: **Attaque:** ${coq.attack} 
                        :boar: **Défense:** ${coq.defense}`)]
            })

        }

    }
}