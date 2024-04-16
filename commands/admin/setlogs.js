const Discord = require('discord.js');

module.exports = {
    name: "setlogs",
    description: "Modifie les logs",
    aliases: ['set-logs'],
    whitelist: true,
    run: async (client, message, args, data) => {

        const options = [
            {
                key: 'xp',
                description: 'logs de palier',
                successMessage: `Les **logs de palier** ont bien été désactivés !`
            },
            {
                key: 'vocal',
                description: `logs d'activité vocale`,
                successMessage: `Les **logs d'activité vocale** ont bien été désactivés !`
            },
            {
                key: 'impots',
                description: `logs d'impôts`,
                successMessage: `Les **logs d'impôts** ont bien été désactivés !`
            },
            {
                key: 'cards',
                description: `logs de drop de carte`,
                successMessage: `Les **drops de cartes** ont bien été désactivés !`
            },
            {
                key: 'war',
                description: `logs de guerre`,
                successMessage: `Les **logs de guerre** ont bien été désactivés !`
            },
            {
                key: 'transaction',
                description: `logs de transaction`,
                successMessage: `Les **logs de transaction** ont bien été désactivés !`
            }
        ];

        const option = options.find(opt => opt.key === args[0]);

        if (!option) {
            const embed = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setTitle(`Informations des logs`)
                .setDescription(
                    options
                        .map(opt => `\`${opt.key}\` : Définit les ${opt.description}`)
                        .join('\n')
                );

            return message.channel.send({ embeds: [embed] });
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel;

        if (!channel || channel.type !== 'GUILD_TEXT') {
            return message.channel.send(`:x: Salon incorrect`);
        }

        const fetchKey = option.key;
        let ActualLogs = data.guild.Logs || {}

        if (ActualLogs[fetchKey] == channel.id) {
            delete ActualLogs[fetchKey]
            await data.guilds.update({ Logs: ActualLogs }, { where: { guildId: message.guild.id }});
            const embed = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(option.successMessage);

            return message.reply({ embeds: [embed] });
        }

        ActualLogs[fetchKey] = channel.id
        await data.guilds.update({ Logs: ActualLogs }, { where: { guildId: message.guild.id }});

        const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:gear: Le salon <#${channel.id}> est maintenant définit comme **${option.description}**`);

        message.reply({ embeds: [embed] });
    }
};
