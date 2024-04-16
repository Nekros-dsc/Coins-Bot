const Discord = require('discord.js');
const { mdelete } = require("../../base/functions");
const { parseHuman } = require("human-ms");
const { Encheres } = require('../../base/Database/Models/Encheres');
const color = require('../../base/functions/color');
const checkGuild = require('../../base/functions/checkGuild');
module.exports = {
    name: "start",
    description: "Lance une enchère",
    usage: "start",
    whitelist: true,
    aliases: ['enchere', 'enchère'],

    run: async (client, message, args, data) => {
        const embedColor = await color(message.member.id, message.guild.id, client, false)
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Modifier un paramètre')
                    .addOptions([
                        {
                            label: 'Salon',
                            description: 'Modifie le salon de l\'enchère',
                            value: 'channel',
                        },
                        {
                            label: 'Temps',
                            description: 'Modifie la durée de l\'enchère',
                            value: 'time',
                        },
                        {
                            label: 'Gain',
                            description: 'Modifie la récompense de l\'enchère',
                            value: 'gain',
                        },
                        {
                            label: 'Prix',
                            description: 'Modifie la somme ajoutée à l\'enchère par participation',
                            value: 'price',
                        },
                        {
                            label: 'Start',
                            description: 'Lance l\'enchère avec vos paramètres',
                            value: 'start',
                            emoji: '🎉'
                        },
                    ]),
            );
        let config = data.guild.EnchereConfig || {}
        let channel = config.channel ? `<#${config.channel}>` : ":x:"
        let time = config.time || ":x:"
        let gain = config.gain || ":x:"
        let price = config.price || ":x:"

        const msg_filter = (m) => m.author.id === message.author.id & !m.author.bot

        const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle('Panel de l\'enchère')
            .setThumbnail("https://media.discordapp.net/attachments/1002173915549937715/1127499599293198366/3d-illustration-of-auction-document-png.png")
            .addField('🌐 Salon', channel, true)
            .addField('🕙 Temps', time, true)
            .addField('🎁 Gain', gain, true)
            .addField('💰 Prix', price, true)
        let msgembed = await message.channel.send({
            embeds: [embed],
            components: [row]
        })

        const collector = msgembed.createMessageComponentCollector({
            
            time: 250000
        })

        collector.on("collect", async (select) => {
            if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
            const value = select.values[0]
            await select.deferUpdate()
            config = (await checkGuild(client.user.id, message.guild.id)).EnchereConfig || {}
            if (value == 'time') {
                message.channel.send(`Veuillez entrer une valeur pour la durée (\`m\`, \`h\`, \`d\`)`).then(mp => {
                    mp.channel.awaitMessages({ filter: msg_filter, max: 1, time: 60000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();

                            if (!msg.content.endsWith("d") && !msg.content.endsWith("h") && !msg.content.endsWith("m") || !msg.content.match(/^\d/)) return message.channel.send(`:timer: Merci de préciser un format de temps valide! (m/h/d)`)
                            let test = parseHuman(time)
                            if (test && isNaN(test)) return message.channel.send(":x: Durée invalide !")
                            if (test > 952200001) return message.channel.send(":x: La durée doit être inférieure à 10 jours !")
                            config["time"] = msg.content
                            await data.guild.update({ EnchereConfig: config }, { where: { guildId: message.guild.id }});

                            message.channel.send(`Vous avez changé la durée de la prochaine enchère à \`\`${msg.content}\`\``).then(m => mdelete(m, 4000));
                            update(msgembed)
                            mp.delete().catch(e => { })
                            msg.delete().catch(e => { })

                        })
                })
            }
            if (value == 'channel') {
                message.channel.send(`Veuillez mentionner le salon de l'enchère:`).then(mp => {
                    mp.channel.awaitMessages({ filter: msg_filter, max: 1, time: 60000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            var channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.content)
                            if (!channel || channel.type !== 'GUILD_TEXT') return message.channel.send(`:x: Salon incorrect`).then(m => mdelete(m, 4000));
                            config["channel"] = channel.id
                            await data.guild.update({ EnchereConfig: config }, { where: { guildId: message.guild.id }});

                            message.channel.send(`Vous avez changé le salon de la prochaine enchère à **${channel}**`).then(m => mdelete(m, 4000));
                            update(msgembed)
                            mp.delete().catch(e => { })
                            msg.delete().catch(e => { })


                        })
                })
            }
            if (value == 'gain') {
                message.channel.send(`Veuillez entrer le gain de l'enchère:`).then(mp => {
                    mp.channel.awaitMessages({ filter: msg_filter, max: 1, time: 60000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (msg.content.length > 40) return message.channel.send(`Message trop long !`).then(m => mdelete(m, 4000));
                            if (msg.attachments.size > 0) return message.channel.send('Veuillez précisez un texte, pas une pièce jointe.').then(m => mdelete(m, 4000));
                            config["gain"] = msg.content
                            await data.guild.update({ EnchereConfig: config }, { where: { guildId: message.guild.id }});
                            message.channel.send(`Vous avez modifié le gain de la prochaine enchère en \`\`${msg.content}\`\``).then(m => mdelete(m, 4000));
                            update(msgembed)
                            mp.delete().catch(e => { })
                            msg.delete().catch(e => { })


                        })
                })
            }
            if (value == 'price') {
                message.channel.send(`Veuillez entrer l'augmentation de l'enchère par clique (recommandé: \`200\`):`).then(mp => {
                    mp.channel.awaitMessages({ filter: msg_filter, max: 1, time: 60000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (isNaN(msg.content) || msg.content <= 50) return message.channel.send(`Chiffre invalide ou impossible à enchérir !`).then(m => mdelete(m, 4000));
                            config["price"] = msg.content
                            await data.guild.update({ EnchereConfig: config }, { where: { guildId: message.guild.id }});
                            message.channel.send(`Vous avez modifié l'augmentation par clique de l'enchère à \`\`${msg.content} coins\`\``).then(m => mdelete(m, 4000));
                            update(msgembed)
                            mp.delete().catch(e => { })
                            msg.delete().catch(e => { })
                        })
                })
            }
            if (value == 'start') {
                let channel = config.channel
                let time = config.time 
                let prize = config.gain 
                let price = config.price 

                if (channel === null || channel === undefined) return message.channel.send(`Vous n'avez pas configuré le salon où je dois lancer l'enchère !`)
                channel = message.guild.channels.cache.get(channel)
                if (!channel) return message.channel.send(`Je ne trouve pas ce salon !`)

                if (!time || !parseHuman(time)) return message.channel.send(`Vous n'avez pas configuré la durée de l'enchère !`)
                if (!prize && prize !== 0) return message.channel.send(`Vous n'avez pas configuré la récompense !`)

                if (price === null || price === undefined) return message.channel.send(`Vous n'avez pas configuré l'augmentation par clique du prix de l'enchère !`)
                msgembed.delete().catch(e => { })
                let enchereTime = parseInt((Date.now() + parseHuman(time)) / 1000)
                let cout = price
                const durationms = parseHuman(time)
                const button = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId("chargement").setEmoji("🎉").setLabel(`Chargement...`).setDisabled(true)
                const button_row = new Discord.ActionRowBuilder().addComponents([button])

                const embed = new Discord.EmbedBuilder()
                    .setTitle(prize)
                    .setImage("https://media.discordapp.net/attachments/1002173915549937714/1051031533256982558/Ventes-aux-encheres-de-destockage.png?width=1440&height=613")
                    .setDescription(`
    Réagissez avec :tada: pour enchérir !
    Se termine <t:${enchereTime}:R> (<t:${enchereTime}>)
    Lancée par: ${message.author}

    Aucun enchérisseur
    Dernier prix: **${cout} coins**
    
    :warning: Le bot ne prend que vos coins en banque !`)
                    .setFooter({ text: `CoinsBot | Se termine` })
                    .setTimestamp(time)
                    .setColor(embedColor)
                await channel.send({
                    embeds: [embed],
                    components: [button_row]
                }).then(async m => {
                    try {
                        await Encheres.create({
                            guildId: message.guild.id,
                            MessageId: m.id,
                            ChannelId: channel.id,
                            prize: prize,
                            author: message.member.id,
                            click: cout,
                            lastenchere: cout,
                            datestart: Date.now(),
                            duration: durationms
                        });
                        message.reply({ content: `Enchère créée dans ${channel}`, allowedMentions: { repliedUser: false } });
                    } catch (e) {
                        console.error(e)
                        message.reply(`:waring: Erreur: \`${e}\``)
                    }
                }).catch(e => { console.log(e); message.channel.send(`Je ne peux pas envoyer de message dans ce salon ! Vérifiez mes permissions.`) })

            }
        })


        function update(m) {
            let config = data.guild.EnchereConfig || {}
            let channel = config.channel ? `<#${config.channel}>` : ":x:"
            let time = config.time || ":x:"
            let gain = config.gain || ":x:"
            let price = config.price || ":x:"


            const embed = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setThumbnail("https://media.discordapp.net/attachments/1002173915549937715/1127499599293198366/3d-illustration-of-auction-document-png.png")
                .setTitle('Panel de l\'enchère')
                .addField('🌐 Salon', channel, true)
                .addField('🕙 Temps', time, true)
                .addField('🎁 Gain', gain, true)
                .addField('💰 Prix', price, true)
            m.edit({ embeds: [embed] })
        }
    }
}