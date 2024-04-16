const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Discord = require("discord.js")
const { parseHuman } = require("human-ms");
const color = require('../../base/functions/color');
const { verifnum } = require('../../base/functions');
const getUser = require('../../base/functions/getUser');
const removeCoins = require('../../base/functions/removeCoins');
const addCoins = require('../../base/functions/addCoins');

module.exports = {
    name: "course",
    description: "Lance une course de cheval",
    usage: "course <mise> <durée_avant_lancement> <#channel/none>",
    cooldown: 5,
    whitelist: true,
    aliases: ['horseracing'],

    run: async (client, message, args, data) => {
        const embedColor = await color(message.member.id, message.guild.id, client, false);

        let gain = args[0];
        if (!gain || !verifnum(gain)) return message.channel.send(":clipboard: Pas de mise précisée (minimum 100) | course <amount> <durée_avant_lancement> <#channel/none>");
        gain = parseInt(gain)
        let dure = args[1];
        if (!dure || !dure.endsWith("d") && !dure.endsWith("h") && !dure.endsWith("m") || !dure.match(/^\d/) || !parseHuman(dure)) return message.channel.send(":timer: Merci de préciser un format de temps valide! (m/h/d)");
        dure = parseHuman(dure);

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.channel;
        if (!channel && channel !== "none") return message.channel.send(":x: Je ne trouve pas ce salon | course <amount> <#channel/none>");

        message.channel.send(`*Course lancée dans ${channel}*`);

        const button1 = new ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('miseur1').setLabel('1');
        const button2 = new ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('miseur2').setLabel('2');
        const button3 = new ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('miseur3').setLabel('3');
        const button4 = new ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('miseur4').setLabel('4');
        const buttonRow = new ActionRowBuilder().addComponents(button1, button2, button3, button4);

        let cheval1 = [];
        let cheval2 = [];
        let cheval3 = [];
        let cheval4 = [];

        let miseur1 = [];
        let miseur2 = [];
        let miseur3 = [];
        let miseur4 = [];
        let miseurs = [];

        const embed = new EmbedBuilder()
            .setTitle("Votez pour un cheval !")
            .setColor(embedColor)
            .setDescription(`_La course commence dans <t:${Math.floor((Date.now() + dure) / 1000)}:R>_\n\n:one: ${position(cheval1).map(pos => `${pos}`).join("")}:horse_racing:\n:two: ${position(cheval2).map(pos => `${pos}`).join("")}:horse_racing:\n:three: ${position(cheval3).map(pos => `${pos}`).join("")}:horse_racing:\n:four: ${position(cheval4).map(pos => `${pos}`).join("")}:horse_racing:`)
            .setImage("https://st3.depositphotos.com/11783088/17601/v/600/depositphotos_176018860-stock-illustration-horsre-racecourse-vector-illustrations.jpg");

        channel.send({ embeds: [embed], components: [buttonRow] }).then(msg => {
            const collector = msg.createMessageComponentCollector({
                componentType: Discord.ComponentType.Button,
                time: dure
            });

            collector.on("collect", async (interaction) => {
                await interaction.deferUpdate();

                if (miseurs.includes(interaction.user.id)) {
                    return interaction.followUp({ content: "Vous avez déjà voté pour un cheval !", ephemeral: true });
                }

                const userBalance = (await getUser(interaction.user.id, message.guild.id)).Coins
                if (userBalance < gain) {
                    return interaction.followUp({ content: `Vous devez avoir ${gain} coins en main pour participer ! (\`${data.guild.Prefix}with ${gain}\`)`, ephemeral: true });
                }

                miseurs.push(interaction.user.id);
                removeCoins(interaction.user.id, message.guild.id, gain, "coins")
                if (interaction.customId === "miseur1") {
                    miseur1.push(interaction.user.id);
                    interaction.followUp({ content: `:moneybag: Vous avez misé ${gain} sur le cheval 1`, ephemeral: true });
                }
                if (interaction.customId === "miseur2") {
                    miseur2.push(interaction.user.id);
                    interaction.followUp({ content: `:moneybag: Vous avez misé ${gain} sur le cheval 2`, ephemeral: true });
                }
                if (interaction.customId === "miseur3") {
                    miseur3.push(interaction.user.id);
                    interaction.followUp({ content: `:moneybag: Vous avez misé ${gain} sur le cheval 3`, ephemeral: true });
                }
                if (interaction.customId === "miseur4") {
                    miseur4.push(interaction.user.id);
                    interaction.followUp({ content: `:moneybag: Vous avez misé ${gain} sur le cheval 4`, ephemeral: true });
                }
            });

            collector.on("end", async () => {
                msg.channel.send(":checkered_flag: La course commence !");
                const interval = setInterval(() => {
                    const horses = [cheval1, cheval2, cheval3, cheval4];
                    const random = Math.floor(Math.random() * horses.length);
                    const selectedHorse = horses[random];
                    selectedHorse.push(":green_square:");

                    embed.setTitle("Course en cours !");
                    embed.setDescription(`:one: ${position(cheval1).map(pos => `${pos}`).join("")}:horse_racing:\n:two: ${position(cheval2).map(pos => `${pos}`).join("")}:horse_racing:\n:three: ${position(cheval3).map(pos => `${pos}`).join("")}:horse_racing:\n:four: ${position(cheval4).map(pos => `${pos}`).join("")}:horse_racing:`);

                    msg.edit({ embeds: [embed], components: [] });

                    if (selectedHorse.length >= 6) {
                        clearInterval(interval);
                        const winningHorse = random + 1;

                        message.channel.send(`:trophy: Le cheval ${winningHorse} a gagné !`);

                        let miseur;
                        let gagnant;

                        switch (winningHorse) {
                            case 1:
                                miseur = miseur1;
                                gagnant = "cheval 1";
                                break;
                            case 2:
                                miseur = miseur2;
                                gagnant = "cheval 2";
                                break;
                            case 3:
                                miseur = miseur3;
                                gagnant = "cheval 3";
                                break;
                            case 4:
                                miseur = miseur4;
                                gagnant = "cheval 4";
                                break;
                        }

                        if (miseur.length > 0) {
                            const som = calc(miseur);
                            message.channel.send(`:dollar: Les joueurs suivants viennent de remporter **${som || "0"} coins**:\n${miseur.map(pos => `<@${pos}>`).join("") || "Personne"}`);
                        } else {
                            message.channel.send(`:drum: Personne n'a misé sur le ${gagnant} !`);
                        }
                    }
                }, 4000);
            });
        });

        function calc(miseur) {
            const totalMiseurs = miseur1.length + miseur2.length + miseur3.length + miseur4.length;
            const coefficient = (totalMiseurs - miseur.length) * gain / miseur.length;

            for (let i = 0; i < miseur.length; i++) {
                addCoins(miseur[i], message.guild.id, coefficient, "coins")
            }

            return parseInt(coefficient - 1);
        }
    }
};

function position(cheval) {
    const a = [];

    for (let i = 0; i < cheval.length; i++) {
        a.push(":green_square:");
    }

    return a;
}
