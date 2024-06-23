const Discord = require('discord.js');
var rslow = require('../../Utils/Functions/roulette');
var myArray = [":grapes:", ":tangerine:", ":green_apple:", ":strawberry:", ":cherries:"];

exports.help = {
  name: 'slots',
  aliases: ['slot'],
  description: 'Lance un slots',
  use: 'Pas d\'utilisation conseillée',
  category: 'Jeux'
}
exports.run = async (bot, message, args, config, data) => {
    let user = message.author;
        if (rslow.roulette[message.author.id] == true) {
            setTimeout(() => {
                rslow.roulette[message.author.id] = false;
            }, 20000);
            return message.channel.send(`:x: Vous avez déjà lancé un jeu ! Veuillez attendre la fin de celui-ci !`)
        }
        let moneydb = JSON.parse(bot.functions.checkUser(bot, message, args, message.author.id).coins).coins
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

        bot.functions.removeCoins(bot, message, args, message.author.id, money, 'coins')

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
            .setThumbnail("https://media.discordapp.net/attachments/1249042420163674153/1249295545667944478/slots.gif?ex=6666c8a4&is=66657724&hm=6329b11e6272b373a042c9bee0d1440d5e52331e6b7829673b7dc6c6da0e8f60&=&width=395&height=223")
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
                    .setThumbnail("https://media.discordapp.net/attachments/1249042420163674153/1249295545667944478/slots.gif?ex=6666c8a4&is=66657724&hm=6329b11e6272b373a042c9bee0d1440d5e52331e6b7829673b7dc6c6da0e8f60&=&width=395&height=223")
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
                    bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de gagner \`\`${money} coins\`\``, 'slots', 'Green')
                } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
                    money *= 2
                    win = true;
                    slots.setDescription(`${myArray[number[0]]} | ${myArray[number[2]]} | ${myArray[number[2]]}\n\nVous avez gagné \`${money} coins\``)
                    bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de gagner \`\`${money} coins\`\``, 'slots', 'Green')
                }
                if (win) {
                    message.reply({ embeds: [slots] })
                    bot.functions.addCoins(bot, message, args, message.author.id, money, 'coins')

                } else {
                    slots.setDescription(`${myArray[number[0]]} | ${myArray[number[1]]} | ${myArray[number[2]]}\n\nVous avez perdu \`${money} coins\``)
                    message.reply({ embeds: [slots] })
                    bot.functions.checkLogs(bot, message, args, message.guild.id, `${message.author.username} vient de perdre \`\`${money} coins\`\``, 'slots', 'Red')
                }
                rslow.roulette[message.author.id] = false
            }, 10000);

    })
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}
