const Discord = require('discord.js');
const ms = require('ms')
exports.help = {
  name: 'settime',
  aliases: ['set-cooldown'],
  description: 'Modifie les cooldowns',
  use: 'settime <work/daily/mine/batiments/antirob> <time (m/h/d)>',
  category: 'Administration',
  perm: "WHITELIST"
}
exports.run = async (bot, message, args, config, data) => {
    const validCommands = [
        'work', 'daily', 'recolt', 'rob', 'mine', 'gift', 'slut',
        'rep', 'braquage', 'hack', 'cambriolage',
        'juge', 'kill', 'arrest', 'antirob', 'blanchisseur', "tattack"
    ];
    
    if (!args[0] || !args[1] || !args[1].match(/^\d/) || !args[1].endsWith("d") && !args[1].endsWith("h") && !args[1].endsWith("m")) {
        return message.reply({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`:timer: Configuration des gains`)
                .setColor(data.color)
                .setDescription(`Pour changer le cooldown entre chaque commande faites :\n\`${data.prefix}settime <work/rep/rob/mine/hack/blanchir/antirob> <time><m/h/d>\``)]
        });
    }

    const command = args[0].toLowerCase();
    const cooldown = ms(args[1]);
    if ((!validCommands.includes(command)) && command !== "antirob") {
        return message.reply(":timer: Cette commande n'est pas configurable !");
    }

    let timeUnit = "s";
    if (cooldown === 1) timeUnit = "";
    let embedDescription 
    if(command == "antirob"){
        embedDescription = `:timer: La durée de l'\`antirob\` a été modifié en ${args[1].replace("d", ` jour${timeUnit}`).replace("m", ` minute${timeUnit}`).replace("h", ` heure${timeUnit}`)}`;
        let timeData = JSON.parse(data.gain)
        timeData["antirob"].time = cooldown
        bot.db.prepare(`UPDATE guild SET gain = @coins WHERE id = @id`).run({ coins: JSON.stringify(timeData), id: message.guild.id});
    } else {
    embedDescription = `:timer: Le cooldown du \`${command}\` a été modifié en ${args[1].replace("d", ` jour${timeUnit}`).replace("m", ` minute${timeUnit}`).replace("h", ` heure${timeUnit}`)}`;
    let timeData = JSON.parse(data.time)
    timeData[command] = cooldown / 1000
    bot.db.prepare(`UPDATE guild SET time = @coins WHERE id = @id`).run({ coins: JSON.stringify(timeData), id: message.guild.id});
    }

    let Embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(embedDescription);

    message.reply({ embeds: [Embed] });
}