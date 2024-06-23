const Discord = require('discord.js');
const arrayEntrepot = ['bar', 'garage', 'magasin', 'gare', 'cinema', 'mairie']
exports.help = {
  name: 'setgain',
  aliases: ['set-gain' , 'setgains'],
  description: 'Modifie les gains',
  use: 'setgain <vocal/cam/bar/join...> <amount>\nsetgain <work/daily/slut/gift/drugs/recolt...>',
  category: 'Administration',
  perm: "WHITELIST"
}
exports.run = async (bot, message, args, config, data) => {
    const prefix = data.prefix
        
    const gainData = {
        vocal: "voicegain",
        voc: "voicegain",
        bar: "bar",
        garage: "garage",
        magasin: "magasin",
        cinema: "cinema",
        gare: "gare",
        mairie: "mairie",
        stream: "streamgain",
        cam: "camgain",
        work: ["workMin", "workMax"],
        daily: ["dailyMin", "dailyMax"],
        gift: ["cardsMin", "cardsMax"],
        slut: ["slutMin", "slutMax"],
        drugs: ["drugsmin", "drugsmax"],
        drug: ["drugsmin", "drugsmax"],
        recolt: ["recmin", "recmax"]
    };

    if (!args[0]) {
        const embed = new Discord.EmbedBuilder()
            .setTitle(`:coin: Configuration des gains`)
            .setColor(data.color)
            .setDescription(`Pour changer le gain via les commandes débutants work et daily utilisez les commandes suivantes :\n\`${prefix}setgain <work/daily> <gain_minimum> <gain_maximum>\`
      
      Pour changer le gain d'argent via les bâtiments toutes les 3 heures utilisez les commandes suivantes :\n\`${prefix}setgain <bar/garage/magasin/cinéma/gare> <gain>\`
      
      Pour changer les gains d'activité vocal toutes les 15 minutes utilisez les commandes suivantes :\n\`${prefix}setgain <vocal/stream/cam> <gain/off>\`
      `);
        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    const arg0 = args[0].toLowerCase();
    let ActualGains = JSON.parse(data.gain)

    if (arg0 === 'vocal' || arg0 === 'voc') {
        if (!isNaN(args[1])) {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`:coin: Le gain des **membres en vocal** a été modifié en ${args[1]} toutes les 15 minutes`)
                .setColor(data.color);


                if(!verifnum(args[1])) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

                ActualGains.voicegain = parseInt(args[1]);
                bot.db.prepare(`UPDATE guild SET gain = @coins WHERE id = @id`).run({ coins: JSON.stringify(ActualGains), id: message.guild.id});

            return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } else if (args[1] === "off") {

            ActualGains.voicegain = 0
            bot.db.prepare(`UPDATE guild SET gain = @coins WHERE id = @id`).run({ coins: JSON.stringify(ActualGains), id: message.guild.id});

            const embed = new Discord.EmbedBuilder()
                .setDescription(`Le gain des membres en vocal a été **désactivé**`)
                .setColor(data.color);
            return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        }
    }

    if (!gainData.hasOwnProperty(arg0)) {
        return message.channel.send(":x: Argument invalide !");
    }

    const gainKey = gainData[arg0];

    if (Array.isArray(gainKey)) {
        if (args.length < 3 || isNaN(args[1]) || isNaN(args[2])) {
            return message.channel.send(":x: Arguments invalides !");
        }
        const [min, max] = args.slice(1).map(Number);

        ActualGains[gainKey[0]] = min;
        ActualGains[gainKey[1]] = max;
        bot.db.prepare(`UPDATE guild SET gain = @coins WHERE id = @id`).run({ coins: JSON.stringify(ActualGains), id: message.guild.id});

        const embed = new Discord.EmbedBuilder()
            .setDescription(`:coin: Les gains pour l'activité "${arg0}" ont été modifiés.\n\nGain minimum : ${min}\nGain maximum : ${max}`)
            .setColor(data.color);
        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    } else {
        if (isNaN(args[1])) {
            return message.channel.send(":x: Argument invalide !");
        }

        if(arrayEntrepot.includes(arg0)) ActualGains[gainKey].gain = Number(args[1]);
        else ActualGains[gainKey] = Number(args[1])
        bot.db.prepare(`UPDATE guild SET gain = @coins WHERE id = @id`).run({ coins: JSON.stringify(ActualGains), id: message.guild.id});

        const embed = new Discord.EmbedBuilder()
            .setDescription(`:coin: Le gain pour l'activité "${arg0}" a été modifié en ${args[1]}`)
            .setColor(data.color);
        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}