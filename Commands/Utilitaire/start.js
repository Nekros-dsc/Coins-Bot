const Discord = require('discord.js');
const { parseHuman } = require("human-ms");
const ms = require('ms')
exports.help = {
  name: 'start',
  aliases: ['enchere' , 'enchère'],
  description: 'Lance une enchère',
  use: 'start',
  category: 'Utilitaire',
  perm: "WHITELIST"
}
exports.run = async (bot, message, args, config2, data) => {
    const embedColor = data.color
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
    let config = JSON.parse(data.EnchereConfig)
    let channel = config.channel || ":x:"
    let time = config.time || ":x:"
    let gain = config.gain || ":x:"
    let price = config.price || ":x:"

    const msg_filter = (m) => m.author.id === message.author.id & !m.author.bot

    const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle('Panel de l\'enchère')
        .setThumbnail("https://media.discordapp.net/attachments/1249042420163674153/1250411169085390938/coins.png?ex=666ad7a6&is=66698626&hm=de9cd377142b361fb0601b79848a56448121a81bfbcdb425937abb4dd2b0a54e&=&format=webp&quality=lossless&width=404&height=404")
        .addFields({ name: '🌐 Salon', value: `${channel !== ":x:" ? `<#${channel}>` : ":x:"}`, inline: true})
        .addFields({ name: '🕙 Temps', value: time, inline: true})
        .addFields({ name: '🎁 Gain', value: gain, inline: true})
        .addFields({ name: '💰 Prix', value: price, inline: true})
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
        if (value == 'time') {
            message.channel.send(`Veuillez entrer une valeur pour la durée (\`m\`, \`h\`, \`d\`)`).then(mp => {
                mp.channel.awaitMessages({ filter: msg_filter, max: 1, time: 60000, errors: ['time'] })
                    .then(async cld => {
                        var msg = cld.first();

                        if (!msg.content.endsWith("d") && !msg.content.endsWith("h") && !msg.content.endsWith("m") || !msg.content.match(/^\d/)) return message.channel.send(`:timer: Merci de préciser un format de temps valide! (m/h/d)`)
                        let test = parseHuman(time)
                        if (test && isNaN(test)) return message.channel.send(":x: Durée invalide !")
                        if (test > 952200001) return message.channel.send(":x: La durée doit être inférieure à 10 jours !")
                        time = msg.content
                        config = { "channel": config.channel, "time": msg.content, "gain": config.gain, "price": config.price }
                        bot.db.prepare(`UPDATE guild SET EnchereConfig = @coins WHERE id = @id`).run({ coins: JSON.stringify(config), id: message.guild.id});

                        message.channel.send(`Vous avez changé la durée de la prochaine enchère à \`\`${msg.content}\`\``).then(m => setTimeout(() => { m.delete() }, 4000));
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
                        const channelo = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.content)
                        if (!channelo || channelo.type !== Discord.ChannelType.GuildText) return message.channel.send(`:x: Salon incorrect`).then(m => setTimeout(() => { m.delete() }, 4000));
                        channel = channelo.id
                        config = { "channel": channelo.id, "time": config.time, "gain": config.gaint, "price": config.price }
                        bot.db.prepare(`UPDATE guild SET EnchereConfig = @coins WHERE id = @id`).run({ coins: JSON.stringify(config), id: message.guild.id});

                        message.channel.send(`Vous avez changé le salon de la prochaine enchère à **${channelo}**`).then(m => setTimeout(() => { m.delete() }, 4000));
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
                        if (msg.content.length > 40) return message.channel.send(`Message trop long !`).then(m => setTimeout(() => { m.delete() }, 4000));
                        if (msg.attachments.size > 0) return message.channel.send('Veuillez précisez un texte, pas une pièce jointe.').then(m => setTimeout(() => { m.delete() }, 4000));
                        gain = msg.content
                        config = { "channel": config.channel, "time": config.time, "gain": msg.content, "price": config.price }
                        bot.db.prepare(`UPDATE guild SET EnchereConfig = @coins WHERE id = @id`).run({ coins: JSON.stringify(config), id: message.guild.id});
                        message.channel.send(`Vous avez modifié le gain de la prochaine enchère en \`\`${msg.content}\`\``).then(m => setTimeout(() => { m.delete() }, 4000));
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
                        if (isNaN(msg.content) || msg.content <= 50) return message.channel.send(`Chiffre invalide ou impossible à enchérir !`).then(m => setTimeout(() => { m.delete() }, 4000));
                        price = msg.content
                        config = { "channel": config.channel, "time": config.time, "gain": config.gain, "price": msg.content }
                        bot.db.prepare(`UPDATE guild SET EnchereConfig = @coins WHERE id = @id`).run({ coins: JSON.stringify(config), id: message.guild.id});
                        message.channel.send(`Vous avez modifié l'augmentation par clique de l'enchère à \`\`${msg.content} coins\`\``).then(m => setTimeout(() => { m.delete() }, 4000));
                        update(msgembed)
                        mp.delete().catch(e => { })
                        msg.delete().catch(e => { })
                    })
            })
        }
        if (value == 'start') {
            if (channel === null || channel === undefined) return message.channel.send(`Vous n'avez pas configuré le salon où je dois lancer l'enchère !`)
            channel = message.guild.channels.cache.get(channel)
            if (!channel) return message.channel.send(`Je ne trouve pas ce salon !`)

            if (!time || !parseHuman(time)) return message.channel.send(`Vous n'avez pas configuré la durée de l'enchère !`)
            if (!price && price !== 0) return message.channel.send(`Vous n'avez pas configuré la récompense !`)

            if (price === null || price === undefined) return message.channel.send(`Vous n'avez pas configuré l'augmentation par clique du prix de l'enchère !`)
            msgembed.delete().catch(e => { })
            let enchereTime = parseInt((Date.now() + parseHuman(time)) / 1000)
            let cout = price
            const durationms = parseHuman(time)
            const button = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId("chargement").setEmoji("🎉").setLabel(`Chargement...`).setDisabled(true)
            const button_row = new Discord.ActionRowBuilder().addComponents([button])

            const embed = new Discord.EmbedBuilder()
                .setTitle(price)
                .setImage("https://media.discordapp.net/attachments/1249042420163674153/1250413094522454047/Ventes-aux-encheres-de-destockage.png?ex=666ad971&is=666987f1&hm=dda30366d2d5da347da01f67768972cc40d9dec268c4ab42832ac4538855c4ea&=&format=webp&quality=lossless&width=3360&height=1429")
                .setDescription(`
Réagissez avec :tada: pour enchérir !
Se termine <t:${enchereTime}:R> (<t:${enchereTime}>)
Lancée par: ${message.author}

Aucun enchérisseur
Dernier prix: **${cout} coins**

:warning: Le bot ne prend que vos coins en banque !`)
                .setFooter({ text: `CoinsBot | Se termine` })
                .setTimestamp(ms(time) + Date.now())
                .setColor(embedColor)
            await channel.send({
                embeds: [embed],
                components: [button_row]
            }).then(async m => {
                try {
                    bot.db.prepare(`INSERT INTO Encheres (num, guildId, MessageId, ChannelId, prize, author, click, lastenchere, datestart, duration) VALUES (@num, @guildId, @MessageId, @ChannelId, @prize, @author, @click, @lastenchere, @datestart, @duration)`).run({
                        num: Math.floor(Math.random() * (999999999999999 - 0 + 1) + 0),
                        guildId: message.guild.id,
                        MessageId: m.id,
                        ChannelId: channel.id,
                        prize: price,
                        author: message.member.id,
                        click: cout,
                        lastenchere: cout,
                        datestart: Date.now(),
                        duration: durationms
                    });
                    message.reply({ content: `Enchère créée dans ${channel}`, allowedMentions: { repliedUser: false } });
                } catch (e) {
                    message.reply(`:waring: Erreur: \`${e}\``)
                }
            }).catch(e => { console.log(e); message.channel.send(`Je ne peux pas envoyer de message dans ce salon ! Vérifiez mes permissions.`) })

        }
    })


    function update(m) {
        const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setThumbnail("https://media.discordapp.net/attachments/1249042420163674153/1250411169085390938/coins.png?ex=666ad7a6&is=66698626&hm=de9cd377142b361fb0601b79848a56448121a81bfbcdb425937abb4dd2b0a54e&=&format=webp&quality=lossless&width=404&height=404")
            .setTitle('Panel de l\'enchère')
            .addFields({ name: '🌐 Salon', value: `${channel !== ":x:" ? `<#${channel}>` : ":x:"}`, inline: true})
            .addFields({ name: '🕙 Temps', value: time, inline: true})
            .addFields({ name: '🎁 Gain', value: gain, inline: true})
            .addFields({ name: '💰 Prix', value: price, inline: true})
        m.edit({ embeds: [embed] })
    }
}