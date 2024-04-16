const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { parseHuman } = require("human-ms");
const color = require('../../base/functions/color');
const { verifnum, msToTime, between } = require('../../base/functions');
const addCoins = require('../../base/functions/addCoins');

module.exports = {
    name: "bingo",
    description: "Lance une course de cheval",
    usage: "bingo <gain> <durée_avant_lancement> <number_max> [#channel]",
    cooldown: 5,
    whitelist: true,
    aliases: ['horseracing'],

    run: async (client, message, args, data) => {
        const embedColor = await color(message.member.id, message.guild.id, client, false);

        let gain = args[0];
        if (!gain || !verifnum(gain)) return message.channel.send(":clipboard: Pas de gain valide précisée (minimum 100) | Exemple: \`bingo 500 5m 100\`");
        gain = parseInt(gain)
        let dure = args[1];
        if (!dure || !dure.endsWith("h") && !dure.endsWith("m") || !dure.match(/^\d/) || !parseHuman(dure)) return message.channel.send(":timer: Merci de préciser un format de temps valide! (m/h) inférieur à 1 jour !");
        dure = parseHuman(dure);
        if (dure >= 86400000) return message.reply(":x: La durée du bingo doit être inférieure à 1 jour !")
        let numbermax = args[2];
        if (!numbermax || !verifnum(numbermax)) return message.channel.send(":clipboard: Pas de nombre maximum valide précisé (min: 5 | max: 10000) | Exemple: \`bingo 500 5m 100\`");
        numbermax = parseInt(numbermax)
        if (numbermax < 5) return message.reply(":x: Le nombre de chiffre dans le bingo doit être supérieur à 5")
        if (numbermax > 10000) return message.reply(":x: Le nombre de chiffre dans le bingo doit être inférieur à 10000")

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[3]) || message.channel;
        if (!channel && channel !== "none") return message.channel.send(":x: Je ne trouve pas ce salon | Exemple: \`bingo 500 5m 100\`");

        message.channel.send(`*Bingo lancé dans ${channel}*`);
        const embed = new EmbedBuilder()
            .setTitle("[BINGO] Trouvez le bon nombre !")
            .setColor(embedColor)
            .setDescription(`_ Vous avez ${msToTime(dure)} pour trouver le bon chiffre_\n\n# Le chiffre est compris entre 1 et ${numbermax}`)
            .setFooter({text: `Le gagnant remportera ${gain} coins !`})
            .setImage("https://media.discordapp.net/attachments/1002173915549937714/1130516154675376229/signe-de-nC3A9on-de-bingo-avec-des-boules-et-des-C3A9toiles-de-loterie.png");

        channel.send({ embeds: [embed] }).then(mm => {
        const randomnumber = between(1, numbermax)
        console.log(randomnumber)
        const collector = channel.createMessageCollector({ filter: (msg) => msg.content == `${randomnumber}` && !msg.author.bot, time: dure, max: 1 });
        collector.on('collect', async msg => {
            collector.stop()
            msg.reply(`# __Vous avez trouvé le nombre mystère qui était ${randomnumber} !__`)
            await addCoins(msg.member.id, message.guild.id, gain, "coins");
        });
        collector.on('end', (collected) => {
            if (collected.size === 0) {
              mm.reply(`# :x: Personne n\'a trouvé le chiffre mystère qui était ${randomnumber} !`);
            }
          });
    })

    }
}