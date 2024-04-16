const Discord = require('discord.js');
var rslow = require('../../roulette.js');
let gain = 2
const { webhook,  mdelete, verifnum } = require("../../base/functions");
const getUser = require("../../base/functions/getUser.js");
const removeCoins = require("../../base/functions/removeCoins.js");
const addCoins = require("../../base/functions/addCoins.js");
const setCooldown = require("../../base/functions/setCooldown.js");
module.exports = {
    name: "pfc",
    description: "Lance un pierre feuille ciseau",
    usage: "pfc @user <mise>",
    aliases: ['pierre-feuille-ciseau'],

    run: async (client, message, args, data) => {
        try {
            const opponent = message.mentions.members.first();
            if (!opponent || opponent.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
            let timeout = 10000
            if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "game", timeout, true))) return
            let mise = args[1]
            let moneymore = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: Vous n'avez pas assez !`);
            if (!mise) return message.channel.send(`:x: Merci de préciser une somme à jouer !`)

            let moneydb = (await getUser(message.member.id, message.guild.id)).Coins
            if (mise === "all") { mise = moneydb }
            if (!verifnum(mise)) return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } })
            mise = parseInt(mise)
            if (mise > moneydb) return message.channel.send({ embeds: [moneymore] });
            let amoneydb = (await getUser(opponent.user.id, message.guild.id)).Coins
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
            message.channel.send({ content: `:question: <@${opponent.user.id}> acceptes-tu le duel de **Pierre feuille ciseau** avec une mise de ${mise} coins contre <@${message.author.id}> ?\n\n_Tu as 30 secondes pour accepter_`, components: [row] }).then(m => {

                const collector = m.createMessageComponentCollector({ time: 60000 });
                collector.on('collect', async (r, user) => {

                    if (opponent.user.id !== r.user.id) return r.reply({ content: `C'est ${opponent.user.username} qui doit cliquer ici !`, ephemeral: true })
                    await r.deferUpdate();
                    if (r.customId === 'valide') {
                        m.delete()
                        if (rslow.roulette[opponent.user.id] == true) {
                            setTimeout(() => {
                                rslow.roulette[opponent.user.id] = false;
                            }, 20000);
                            return r.reply({ content: `:x: Vous avez déjà lancé un jeu ! Veuillez attendre la fin de celui-ci !`, ephemeral: true })
                        }
                        rslow.roulette[message.author.id] = true;
                        rslow.roulette[opponent.user.id] = true;

                        removeCoins(opponent.user.id, message.guild.id, mise, "coins");
                        removeCoins(message.member.id, message.guild.id, mise, "coins");
                        let Embed2 = new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setTitle(`Pierre feuille ciseau entre ${message.author.username} et ` + opponent.user.username)
                            .setDescription(`**Objectif**:\nChoisir le bon objet pour battre l'adversaire !\n__Exemple:__`)
                            .setImage(`https://media.discordapp.net/attachments/815476219130150922/971854418125406348/unknown.png`)
                            .setFooter({ text: `5 secondes avant le début` })
                        message.channel.send({ embeds: [Embed2] }).then(m => { mdelete(m, 4000) });
                        setTimeout(async () => {
                            const positions = {
                                three: '_ _        :right_fist:       **Pierre**         :left_fist:',
                                two: '_ _        :right_fist:       **Feuille**         :left_fist:',
                                one: '_ _        :right_fist:       **Ciseau**         :left_fist:',
                                go: '_ _        :right_fist:       **CHOISISSEZ !**         :left_fist:'
                            };

                            let button_next = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('pierre').setLabel(`Pierre`).setDisabled(true);
                            let useless = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('feuille').setLabel('Feuille').setDisabled();
                            let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('ciseau').setLabel(`Ciseau`).setDisabled(true);

                            let button_row = new Discord.ActionRowBuilder().addComponents([button_next, useless, button_back])
                            const msg = await message.channel.send({
                                content: positions.three,
                                components: [button_row],
                                allowedMentions: { repliedUser: false }

                            })
                            function countdown() {
                                setTimeout(() => {
                                    msg.edit({
                                        content: positions.two,
                                    });
                                }, 1000);
                                setTimeout(() => {
                                    msg.edit({
                                        content: positions.one,
                                    });
                                }, 2000);
                                setTimeout(() => {
                                    button_row.components[0].setDisabled(false);
                                    button_row.components[1].setDisabled(false);
                                    button_row.components[2].setDisabled(false);

                                    msg.edit({
                                        content: positions.go,
                                        components: [button_row],
                                    });
                                }, 3000);
                            }
                            countdown();

                            const filter = button => {
                                return button.user.id == message.author.id || button.user.id == opponent.user.id;
                            };

                            let jeu_author
                            let jeu_opponent
                            const collector = msg.createMessageComponentCollector({
                                filter,
                                componentType: Discord.ComponentType.Button,
                                time: 14999
                            })
                            collector.on("collect", async (button) => {
                                await button.deferUpdate();
                                if (button.isButton()) {
                                    if (button.customId === 'pierre' && (button.user.id == message.author.id || button.user.id == opponent.user.id)) {
                                        if (button.user.id === message.author.id) jeu_author = "pierre"
                                        if (button.user.id === opponent.user.id) jeu_opponent = "pierre"

                                        return button.followUp({ content: `${button.user}, vous avez choisi **Pierre** !`, ephemeral: true });
                                    }
                                    else if (button.customId === 'feuille' && (button.user.id == message.author.id || button.user.id == opponent.user.id)) {
                                        if (button.user.id === message.author.id) jeu_author = "feuille"
                                        if (button.user.id === opponent.user.id) jeu_opponent = "feuille"


                                        return button.followUp({ content: `${button.user}, vous avez choisi **Feuille** !`, ephemeral: true });
                                    }
                                    else if (button.customId === 'ciseau' && (button.user.id == message.author.id || button.user.id == opponent.user.id)) {
                                        if (button.user.id === message.author.id) jeu_author = "ciseau"
                                        if (button.user.id === opponent.user.id) jeu_opponent = "ciseau"
                                        return button.followUp({ content: `${button.user}, vous avez choisi **Ciseau** !`, ephemeral: true });
                                    }
                                }
                            })
                            setTimeout(async () => {
                                rslow.roulette[message.author.id] = false;
                                rslow.roulette[opponent.user.id] = false;
                                if (!jeu_author || !jeu_opponent) {
                                    msg.reply({ content: `> L'un des deux joueurs n'a pas joué !\nVous avez été remboursé !` });

                                    addCoins(message.member.id, message.guild.id, mise, "coins");
                                    addCoins(opponent.user.id, message.guild.id, mise, "coins");
                                    return;
                                }

                                if (jeu_author === jeu_opponent) {
                                    msg.reply({ content: `> Égalité !\nVous avez tous les deux choisi **${jeu_author}** !` });

                                    addCoins(message.member.id, message.guild.id, mise, "coins");
                                    addCoins(opponent.user.id, message.guild.id, mise, "coins");
                                    return;
                                }
                                let authorBalanceUpdate = 0;
                                let opponentBalanceUpdate = 0;

                                if ((jeu_author === 'ciseau' && jeu_opponent === 'feuille') ||
                                    (jeu_author === 'pierre' && jeu_opponent === 'ciseau') ||
                                    (jeu_author === 'feuille' && jeu_opponent === 'pierre')) {
                                    msg.reply({ content: `> Victoire de ${message.author} !\nIl a choisi **${jeu_author}** et ${opponent.user} a choisi **${jeu_opponent}** !` });
                                    authorBalanceUpdate = mise * gain;
                                } else {
                                    msg.reply({ content: `> Victoire de ${opponent.user} !\nIl a choisi **${jeu_opponent}** et ${message.author} a choisi **${jeu_author}** !` });
                                    opponentBalanceUpdate = mise * gain;
                                }
                                if(authorBalanceUpdate) addCoins(message.member.id, message.guild.id, authorBalanceUpdate, "coins");
                                if(opponentBalanceUpdate) addCoins(opponent.user.id, message.guild.id, opponentBalanceUpdate, "coins");

                            }, 15000);
                        }, 5000);
                    }

                })
            })
        } catch (error) {
            webhook(error, message)
        }
    }
};