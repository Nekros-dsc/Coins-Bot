const Discord = require('discord.js');
const { verifnum } = require('../../base/functions');

module.exports = {
    name: "setgain",
    description: "Modifie les gains",
    usage: "setgain <vocal/cam/bar/work...> 100",
    aliases: ['set-gain', 'setgains'],
    whitelist: true,
    run: async (client, message, args, data) => {
        const prefix = data.guild.prefix
        
        const gainData = {
            vocal: "voicegain",
            voc: "voicegain",
            bar: "bargain",
            garage: "garagegain",
            magasin: "magasingain",
            cinema: "cinemagain",
            gare: "garegain",
            mairie: "mairiegain",
            stream: "streamgain",
            cam: "camgain",
            work: ["wmin", "wmax"],
            daily: ["dmin", "dmax"],
            gift: ["gfmin", "gfmax"],
            slut: ["smin", "smax"],
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
        let ActualGains = data.guild.Gains || {}

        if (arg0 === 'vocal' || arg0 === 'voc') {
            if (!isNaN(args[1])) {
                const embed = new Discord.EmbedBuilder()
                    .setDescription(`:coin: Le gain des **membres en vocal** a été modifié en ${args[1]} toutes les 15 minutes`)
                    .setColor(data.color);


                    if(!verifnum(args[1])) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

                    ActualGains.voicegain = parseInt(args[1]);
                await data.guilds.update({ Gains: ActualGains }, { where: { guildId: message.guild.id }});

                return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            } else if (args[1] === "off") {

                delete ActualGains.voicegain;
                await data.guilds.update({ Gains: ActualGains }, { where: { guildId: message.guild.id }});

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
            await data.guilds.update({ Gains: ActualGains }, { where: { guildId: message.guild.id }});

            const embed = new Discord.EmbedBuilder()
                .setDescription(`:coin: Les gains pour l'activité "${arg0}" ont été modifiés.\n\nGain minimum : ${min}\nGain maximum : ${max}`)
                .setColor(data.color);
            return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } else {
            if (isNaN(args[1])) {
                return message.channel.send(":x: Argument invalide !");
            }

            ActualGains[gainKey] = Number(args[1]);
            await data.guilds.update({ Gains: ActualGains }, { where: { guildId: message.guild.id }});

            const embed = new Discord.EmbedBuilder()
                .setDescription(`:coin: Le gain pour l'activité "${arg0}" a été modifié en ${args[1]}`)
                .setColor(data.color);
            return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        }
    }
}
