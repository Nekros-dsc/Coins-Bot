const Discord = require('discord.js');
var rslow = require('../../Utils/Functions/roulette');

exports.help = {
  name: 'gunfight',
  aliases: ['gun' , 'gf'],
  description: 'Lance une partie de GunFight',
  use: 'Pas d\'utilisation conseillée',
  category: 'Jeux'
}
exports.run = async (bot, message, args, config, data) => {
    const opponent = message.mentions.members.first();
    if (!opponent || opponent.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
    let timeout = 10000

    if (rslow.roulette[message.author.id] == true) {
        setTimeout(() => {
            rslow.roulette[message.author.id] = false;
        }, 20000);
        return message.channel.send(`:x: Vous avez déjà lancé un jeu ! Veuillez attendre la fin de celui-ci !`)
    }
    let mise = args[1]
    let moneymore = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous n'avez pas assez !`);
    if (!mise) return message.channel.send(`:x: Merci de préciser une somme à jouer !`)
    let moneydb = JSON.parse(bot.functions.checkUser(bot, message, args, message.author.id).coins).coins
    if (!verifnum(mise)) return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } })

    if (mise === "all") { mise = moneydb }
    if (parseInt(mise) > parseInt(moneydb)) return message.channel.send({ embeds: [moneymore] });
    let amoneydb = JSON.parse(bot.functions.checkUser(bot, message, args, opponent.user.id).coins).coins
    if (amoneydb < mise) return message.reply({ content: `:x: **${opponent.user.username} n'a pas assez de coins pour jouer avec vous !** Il doit avoir en main la somme misée pour jouer !`, allowedMentions: { repliedUser: false } })

    if (message.author.id === opponent.user.id) return message.channel.send('Tu peux pas jouer avec toi même !')

    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('valide')
                .setLabel('✅')
                .setStyle(Discord.ButtonStyle.Success),
        );
    message.channel.send({ content: `:question: <@${opponent.user.id}> acceptes-tu le duel de **Gun** avec une mise de ${mise} coins contre <@${message.author.id}> ?\n\n_Tu as 30 secondes pour accepter_`, components: [row] }).then(m => {

        const collector = m.createMessageComponentCollector({ time: 60000 });
        collector.on('collect', async (r, user) => {
            if (opponent.user.id !== r.user.id) return r.reply({ content: `C'est ${opponent.user.username} qui doit cliquer ici !`, ephemeral: true })
            await r.deferUpdate();
            if (r.customId === 'valide') {
                rslow.roulette[message.author.id] = true;
                rslow.roulette[opponent.user.id] = true;
                m.delete()
                bot.functions.removeCoins(bot, message, args, message.author.id, mise, 'coins')
                bot.functions.removeCoins(bot, message, args, opponent.user.id, mise, 'coins')
                let Embed2 = new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setTitle(`Duel de gun entre ${message.author.username} et ` + opponent.user.username)
                    .setDescription(`**Objectif**:\nÊtre le premier à cliquer sur son boutton !\n__Exemple:__`)
                    .setImage(`https://media.discordapp.net/attachments/1249042420163674153/1249276895967838228/unknown.png?ex=6666b746&is=666565c6&hm=f86fc006c6daee98630fcc6e21ce112831f9817334e7675726bb94fec1fc465b&=&format=webp&quality=lossless&width=728&height=131`)
                    .setFooter({ text: `5 secondes avant le début` })
                message.channel.send({ embeds: [Embed2] }).then(m => { setTimeout(() => { m.delete() }, 4000) });
                setTimeout(async () => {
                    const positions = {
                        three: '_ _        :levitate: :point_right:      **3**        :point_left: :levitate:',
                        two: '_ _        :levitate: :point_right:      **2**        :point_left: :levitate:',
                        one: '_ _        :levitate: :point_right:      **1**        :point_left: :levitate:',
                        go: '_ _        :levitate: :point_right:      **GO !**        :point_left: :levitate:',
                        ended1: '_ _     :levitate: :point_right:      **STOP !**        :skull_crossbones: :levitate:',
                        ended2: '_ _     :levitate: :skull_crossbones:      **STOP !**        :point_left: :levitate:',
                    };

                    let button_next = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('shoot1').setLabel(`Tire ${message.author.username} !`).setDisabled(true);
                    let useless = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('useless').setEmoji("⚔️").setDisabled();
                    let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('shoot2').setLabel(`Tire ${opponent.user.username} !`).setDisabled(true);

                    let button_row = new Discord.ActionRowBuilder().addComponents([button_back, useless, button_next])
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


                    const collector = msg.channel.createMessageComponentCollector({
                        filter,
                        componentType: Discord.ComponentTypeButton,
                        time: 5000
                    })
                    collector.on("collect", async (button) => {

                        if (button.customId === 'shoot1' && button.user.id == message.author.id) {
                            collector.stop()
                            msg.edit({
                                content: positions.ended1,
                                components: [button_row],
                            });
                            bot.functions.addCoins(bot, message, args, message.author.id, mise * gain, 'coins')
                            button.reply({ content: `<@${message.author.id}> remporte ce duel !\nLa mise de \`${mise * gain} coins\` a bien été versée sur son compte !` });
                        }
                        else if (button.customId === 'shoot2' && button.user.id == opponent.user.id) {
                            collector.stop()
                            msg.edit({
                                content: positions.ended1,
                                components: [button_row],
                            });
                            bot.functions.addCoins(bot, message, args, opponent.user.id, mise * gain, 'coins')
                            button.reply({ content: `<@${opponent.user.id}> remporte ce duel !\nLa mise de \`${mise * gain} coins\` a bien été versée sur son compte !` });
                        }
                        delete rslow.roulette[message.author.id];
                        delete rslow.roulette[opponent.user.id];

                    })
                }, 5000);
            }

        })
    })
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}