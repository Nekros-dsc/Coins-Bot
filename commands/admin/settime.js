const Discord = require('discord.js');
const ms = require("ms");
const { webhook, wl } = require("../../base/functions");

module.exports = {
    name: "settime",
    description: "Modifie les cooldowns",
    usage: "settime <work/daily/mine> <time><m/h/d>",
    aliases: ['set-cooldown'],
    whitelist: true,
    run: async (client, message, args, data) => {
        try {

            const validCommands = [
                'work', 'daily', 'recolt', 'rob', 'mine', 'gift', 'slut',
                'rep', 'war', 'braquage', 'hack', 'cambriolage',
                'juge', 'kill', 'arrest', 'antirob', 'blanchisseur', 'game', "tattack"
            ];
            
            if (!args[0] || !args[1] || !args[1].match(/^\d/) || !args[1].endsWith("d") && !args[1].endsWith("h") && !args[1].endsWith("m")) {
                return message.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setTitle(`:timer: Configuration des gains`)
                        .setColor(data.color)
                        .setDescription(`Pour changer le cooldown entre chaque commande faites :\n\`${data.guild.Prefix}settime <work/rep/rob/mine/hack/blanchir/antirob> <time><m/h/d>\``)]
                });
            }

            const command = args[0].toLowerCase();
            const cooldown = ms(args[1]);
            const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
            if ((!cmd || !validCommands.includes(cmd.name)) && command !== "antirob") {
                return message.reply(":timer: Cette commande n'est pas configurable !");
            }

            let timeUnit = "s";
            if (cooldown === 1) timeUnit = "";
            let embedDescription 
            if(command == "antirob"){
                embedDescription = `:timer: La durée de l'\`antirob\` a été modifié en ${args[1].replace("d", ` jour${timeUnit}`).replace("m", ` minute${timeUnit}`).replace("h", ` heure${timeUnit}`)}`;
            } else {
            embedDescription = `:timer: Le cooldown du \`${cmd.name}\` a été modifié en ${args[1].replace("d", ` jour${timeUnit}`).replace("m", ` minute${timeUnit}`).replace("h", ` heure${timeUnit}`)}`;

            }
            await data.guilds.update(
                { Cooldowns: { ...data.guilds.Cooldowns, [command]: cooldown } },
                { where: { guildId: message.guild.id } }
            );

            let Embed = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(embedDescription);

            message.reply({ embeds: [Embed] });

        } catch (error) {
            webhook(error, message);
        }
    }
};
