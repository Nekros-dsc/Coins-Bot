const Discord = require('discord.js');
var myArray = [":grapes:", ":tangerine:", ":green_apple:", ":strawberry:", ":cherries:"];
const { webhook, wlog, verifnum } = require("../../base/functions");
const getUser = require("../../base/functions/getUser");
const removeCoins = require("../../base/functions/removeCoins");
const addCoins = require("../../base/functions/addCoins");
var rslow = require('../../roulette.js');
module.exports = {
    name: "slots",
    description: "Lance un slots",
    param: "<amount/all>",
    aliases: ['slot'],

    run: async (client, message, args, data) => {
        let user = message.author;
        if (rslow.roulette[message.author.id] == true) {
            setTimeout(() => {
                rslow.roulette[message.author.id] = false;
            }, 20000);
            return message.channel.send(`:x: Vous avez déjà lancé un jeu ! Veuillez attendre la fin de celui-ci !`)
        }
        let moneydb = (await getUser(user.id, message.guild.id)).Coins
        moneydb = parseInt(moneydb)
        let money = args[0]
        let win = false;
        let moneymore = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:x: Vous n'avez pas assez de coins !`)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

        let moneyhelp = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:x: Précisez un montant à miser | slots <amount/all>`);
        if (!money) return message.channel.send({ embeds: [moneyhelp] });

        if (money === "all") { money = moneydb } else {
            if (!verifnum(money)) return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } })
        }
        if (money > moneydb || money <= 0) return message.channel.send({ embeds: [moneymore] });

        removeCoins(message.member.id, message.guild.id, money, "coins")

        let slots = new Discord.EmbedBuilder()
            .setDescription(`** **`)
            .setColor(data.color)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

        var rand = Math.floor(Math.random() * myArray.length);
        var rValue = myArray[rand];
        var rand = Math.floor(Math.random() * myArray.length);
        var rValue2 = myArray[rand];
        var rand = Math.floor(Math.random() * myArray.length);
        var rValue3 = myArray[rand];

        rslow.roulette[message.author.id] = true
        let embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`${rValue} | ${rValue2} | ${rValue3}`)
            .setDescription(user.username + ` vient de lancer un **slots** en misant \`${money} coins\` !      
`)
            .setThumbnail("https://media.tenor.com/images/01f2fce15461365c59981176ece3791d/tenor.gif")
            .setFooter({ text: `${message.member.user.username} | 10 secondes avant le résultat`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
        message.channel.send({ embeds: [embed] }).then(mm => {

            var intervall = setInterval(function () {
                update(mm, user, money)
            }, 2000);

            let update = function (mess, user, money) {
                var rand = Math.floor(Math.random() * myArray.length);
                var rValue = myArray[rand];
                var rand = Math.floor(Math.random() * myArray.length);
                var rValue2 = myArray[rand];
                var rand = Math.floor(Math.random() * myArray.length);
                var rValue3 = myArray[rand];
                embed = new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setTitle(`${rValue} | ${rValue2} | ${rValue3}`)
                    .setDescription(user.username + ` vient de lancer un **slots** en misant \`${money} coins\` !      
`)
                    .setThumbnail("https://media.tenor.com/images/01f2fce15461365c59981176ece3791d/tenor.gif")
                    .setFooter({ text: `${message.member.user.username} | 10 secondes avant le résultat`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                mess.edit({ embeds: [embed] })

            }

            let att = setTimeout(() => {
                clearInterval(intervall);

                let number = []
                for (i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * myArray.length); }

                if (number[0] == number[1] && number[1] == number[2]) {
                    money *= 3

                    win = true;
                    slots.setDescription(`${myArray[number[0]]} | ${myArray[number[0]]} | ${myArray[number[0]]}\n\nVous avez gagné \`${money} coins\``)
                    wlog(message.author, "GREEN", message.guild, `${message.author.tag} vient de gagner \`\`${money} coins\`\``, "Slots")
                } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
                    money *= 2
                    win = true;
                    slots.setDescription(`${myArray[number[0]]} | ${myArray[number[2]]} | ${myArray[number[2]]}\n\nVous avez gagné \`${money} coins\``)
                    wlog(message.author, "GREEN", message.guild, `${message.author.tag} vient de gagner \`\`${money} coins\`\``, "Slots")
                }
                if (win) {
                    message.reply({ embeds: [slots] })
                    addCoins(message.member.id, message.guild.id, money, "coins")

                } else {
                    slots.setDescription(`${myArray[number[0]]} | ${myArray[number[1]]} | ${myArray[number[2]]}\n\nVous avez perdu \`${money} coins\``)
                    message.reply({ embeds: [slots] })
                    wlog(message.author, "RED", message.guild, `${message.author.tag} vient de perdre \`\`${money} coins\`\``, "Slots")
                }
                rslow.roulette[message.author.id] = false
            }, 10000);

        })

    }
}


