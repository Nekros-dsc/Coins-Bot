const Discord = require('discord.js');
var rslow = require('../../Utils/function/roulette');
let gain = 2
const createP4ActionRow = (pawns, currentPlayerPos, possibleActionsRow) => {
    let backgroundStyle = Discord.ButtonStyle.Primary;
    if (currentPlayerPos == 1) {
        backgroundStyle = Discord.ButtonStyle.Danger
    } else {
        backgroundStyle = Discord.ButtonStyle.Primary
    }
    buttonRow = new ActionRowBuilder()
    buttonRow2 = new ActionRowBuilder()

    possibleActionsRow.forEach((el, i) => { // not enough space 5 /line
        if (i < 5) {
            buttonRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`${el.id}`)
                    .setLabel(`${i + 1}`)
                    .setStyle(backgroundStyle)
                    .setDisabled(el.isDisabled)
            )
        } else if (i >= 5 && i <= 7) {
            buttonRow2.addComponents(
                new ButtonBuilder()
                    .setCustomId(`${el.id}`)
                    .setLabel(`${i + 1}`)
                    .setStyle(backgroundStyle)
                    // .setEmoji(pawnEmoji)
                    .setDisabled(el.isDisabled)
            )
        }
    });
    return [buttonRow, buttonRow2];
}
const createGameBoard = (pawns) => {
    let arr = [];
    for (var y = 0; y < 6; y++) {
        arr[y] = [];

        for (var x = 0; x < 7; x++) {
            arr[y][x] = `${pawns.empty}`; //
        }
    }

    return arr;
}

const addToGameBoard = (pawns, gameBoardArray, currentPlayerPos, xPos) => {

    xPos -= 1;
    let i = 0;
    let isPossible = true;

    while (gameBoardArray[i][xPos] !== `${pawns.empty}`) {
        i++;
        if (i > 5) {
            isPossible = false;
            break
        };
    }
    if (isPossible) {
        let pawnEmoji;
        if (currentPlayerPos == 1) {
            pawnEmoji = pawns.player1
        } else {
            pawnEmoji = pawns.player2
        }
        gameBoardArray[i][xPos] = pawnEmoji;
    }
    return { isPossible, gameBoardArray }
}

const chkLine = (pawns, a, b, c, d) => {
    // Check first cell non-zero and all cells match
    return ((a != `${pawns.empty}`) && (a == b) && (a == c) && (a == d));
}


const checkIfIsWin = (pawns, bd) => {
    // Check down
    for (r = 0; r < 3; r++)
        for (c = 0; c < 7; c++)
            if (chkLine(pawns, bd[r][c], bd[r + 1][c], bd[r + 2][c], bd[r + 3][c]))
                return bd[r][c];

    // Check right
    for (r = 0; r < 6; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(pawns, bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3]))
                return bd[r][c];

    // Check down-right
    for (r = 0; r < 3; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(pawns, bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3]))
                return bd[r][c];

    // Check down-left
    for (r = 3; r < 6; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(pawns, bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3]))
                return bd[r][c];

    return false;
}
const makeGridLine = (gameBoardArray, id) => {
    let line = ''
    gameBoardArray[id].forEach(element => {
        line += element
    });
    return line;
}


exports.help = {
  name: 'puissance4',
  aliases: ['p4' , 'power4' ],
  description: 'jouer à Puissance 4',
  use: 'Pas d\'utilisation conseillée',
  category: 'Jeux'
}
exports.run = async (bot, message, args, config, data) => {
    let user = message.author
    let userID = user.id;
    let opnt = message.mentions?.users.first();
    let opntID;

    isWaitingNewPlayer = false;
    if (!opnt) {
        isWaitingNewPlayer = true;
        opntID = null;
        return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
    } else {
        opntID = opnt.id;
    }
    let mise = args[1]
    let moneymore = new EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous n'avez pas assez !`);
    if (!mise) return message.channel.send(`:x: Merci de préciser une somme à jouer !`)
    let moneydb = JSON.parse(bot.functions.checkUser(bot, message, args, message.author.id).coins).coins
    if (mise === "all") { mise = moneydb }
    if (!verifnum(mise)) return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } })
    mise = parseInt(mise)
    if (mise > moneydb) return message.channel.send({ embeds: [moneymore] });
    let amoneydb = JSON.parse(bot.functions.checkUser(bot, message, args, opnt.id).coins).coins
    if (amoneydb < mise) return message.reply({ content: `:x: **${opnt.username} n'a pas assez de coins pour jouer avec vous !** Il doit avoir en main la somme misée pour jouer !`, allowedMentions: { repliedUser: false } })

    if (opntID == userID) return message.channel.send("Tu ne peux pas jouer avec toi même !");

    let possibleActionsRow = [
        { id: "action/1", isDisabled: false },
        { id: "action/2", isDisabled: false },
        { id: "action/3", isDisabled: false },
        { id: "action/4", isDisabled: false },
        { id: "action/5", isDisabled: false },
        { id: "action/6", isDisabled: false },
        { id: "action/7", isDisabled: false }
    ]
    let pawns = {
        player1: '🟥',
        player2: '🟦',
        empty: '🔲',
    }

    let preEmbd = new EmbedBuilder()
        .setFooter({ text: config.footerText })
        .setColor(data.color)


    let acceptButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`accept`)
                .setStyle(Discord.ButtonStyle.Success)
                .setEmoji('✅')
        )

    let newMsg = await message.channel.send({ content: `:question: <@${opnt.id}> acceptes-tu le duel de **Puissance 4** contre <@${message.author.id}> ?\n\n_Tu as 30 secondes pour accepter_`, components: [acceptButton] });

    let currentPlayerPos;
    let players;
    let gameBoardArray;
    const collector = newMsg.createMessageComponentCollector(
        (button) => button,
        { time: 305000 }
    )

    const startNewGame = (i) => {
        if (rslow.roulette[opnt.id] == true) {
            setTimeout(() => {
                rslow.roulette[opnt.id] = false;
            }, 20000);
            return i.reply(`:x: <@${opnt.id}> a déjà un jeu en cours ! Veuillez attendre la fin de celui-ci !`)
        }
        if (rslow.roulette[message.author.id] == true) {
            setTimeout(() => {
                rslow.roulette[message.author.id] = false;
            }, 20000);
            return i.reply(`:x: <@${message.author.id}> a déjà un jeu en cours ! Veuillez attendre la fin de celui-ci !`)
        }
        rslow.roulette[message.author.id] = true;
        rslow.roulette[opnt.id] = true;
        bot.functions.removeCoins(bot, message, args, opnt.id, mise, 'coins')
        bot.functions.removeCoins(bot, message, args, message.author.id, mise, 'coins')
        bot.functions.addCoins(bot, message, args, message.author.id, mise, 'bank')
        bot.functions.addCoins(bot, message, args, opnt.id, mise, 'bank')
        currentPlayerPos = Math.floor(Math.random() * 2);

        gameBoardArray = createGameBoard(pawns);


        let rawGameBoard = `${makeGridLine(gameBoardArray, 5)}\n${makeGridLine(gameBoardArray, 4)}\n${makeGridLine(gameBoardArray, 3)}\n${makeGridLine(gameBoardArray, 2)}\n${makeGridLine(gameBoardArray, 1)}\n${makeGridLine(gameBoardArray, 0)}\n:one::two::three::four::five::six::seven:`
        preEmbd.setDescription(`<@${players[currentPlayerPos].id}> joue en premier\n${rawGameBoard}`)

        i.update({ content: " ", embeds: [preEmbd], components: createP4ActionRow(pawns, currentPlayerPos, possibleActionsRow) });

    }
    collector.on('collect', async i => {
        try {
            if (i.customId !== 'joinGame' && i.user.id !== opntID && i.user.id !== userID) {
                return i.reply({ content: `Tu ne peux pas cliquer ici !`, ephemeral: true })
            }
            switch (i.customId) {
                case "joinGame":
                    if (i.user.id == userID) {
                        i.reply({ content: "Tu ne peux pas rejoindre ta propre partie !", ephemeral: true });
                    } else {
                        opnt = i.user;
                        opntID = i.user.id;
                        players = [user, opnt];
                        startNewGame(i);
                    }
                    break;
                case "accept":
                    if (i.user.id === opntID) {
                        players = [user, opnt];
                        startNewGame(i);
                    }
                    break;

                case 'action/1':
                case 'action/2':
                case 'action/3':
                case 'action/4':
                case 'action/5':
                case 'action/6':
                case 'action/7':
                    if (i.user.id === players[currentPlayerPos].id) {
                        const xPos = i.customId.split('/')[1];



                        let result = { isPossible, gameBoardArray } = addToGameBoard(pawns, gameBoardArray, currentPlayerPos, xPos)

                        if (result.isPossible) {
                            gameBoardArray = result.gameBoardArray;
                            let rawGameBoard = `${makeGridLine(gameBoardArray, 5)}\n${makeGridLine(gameBoardArray, 4)}\n${makeGridLine(gameBoardArray, 3)}\n${makeGridLine(gameBoardArray, 2)}\n${makeGridLine(gameBoardArray, 1)}\n${makeGridLine(gameBoardArray, 0)}\n:one::two::three::four::five::six::seven:`

                            const isWin = checkIfIsWin(pawns, gameBoardArray)
                            if (isWin) {
                                bot.functions.removeCoins(bot, message, args, message.author.id, mise, 'bank')
                                bot.functions.removeCoins(bot, message, args, opnt.id, mise, 'bank')
                                preEmbd.setDescription(`:trophy: **<@${players[currentPlayerPos].id}> a gagné !** \nLa mise de \`${mise * gain} coins\` a bien été versée sur son compte !\n ${rawGameBoard}`)
                                bot.functions.addCoins(bot, message, args, message.author.id, mise * gain, 'coin')
                                i.update({ embeds: [preEmbd], components: [] });
                                rslow.roulette[message.author.id] = false;
                                rslow.roulette[opnt.id] = false;
                            } else {
                                lastPlayerPos = currentPlayerPos;
                                if (currentPlayerPos == 1) currentPlayerPos = 0;
                                else if (currentPlayerPos == 0) currentPlayerPos = 1;

                                preEmbd.setDescription(`Au tour de <@${players[currentPlayerPos].id}>\n ${rawGameBoard}`)
                                i.update({ embeds: [preEmbd], components: createP4ActionRow(pawns, currentPlayerPos, possibleActionsRow) });

                            }


                        } else {
                            i.reply({ content: `Tu ne peux pas placer de pion ici !`, ephemeral: true })
                        }
                    } else {

                        i.reply({ content: "Ce n'est pas ton tour !", ephemeral: true });
                    }
                    break;


                default:
                    i.reply({ content: "ERREUR :x:" });
                    break;
            }
        } catch (err) {
            console.error("power 4 game collector error: ", err);
        }
    });
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}