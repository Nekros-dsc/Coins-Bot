const config = require('../config.json');
const items = require("../shop.json")
const Canvas = require('canvas');
const Discord = require('discord.js');
const checkGuild = require('./functions/checkGuild');
const { Bots } = require('./Database/Models/Bots');
const { Cards } = require('./Database/Models/Cards');
const { Op, Sequelize } = require('sequelize');
module.exports = {
    mdelete(m, t) {
        let a = []
        a.push(m)
        setTimeout(async () => {
            await m.channel.bulkDelete(a);
        }, t)
    },
    between(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(
            Math.random() * (max - min + 1) + min
        )
    },
    async ownersend(client, m) {
        const botDB = await Bots.findOne({
            where: {
                botid: client.user.id
            }
        });
        if (!botDB) return
        let actualowners = JSON.parse(botDB.Owners) || {}
        let owners = Object.keys(actualowners);
        if (!owners) { return } else {
            for (let i = 0; i < owners.length; i++) {
                if (owners === null) continue;
                let g = client.users.cache.get(owners[i])
                if (g) {
                    g.send(m).catch(e => { })
                }
            }
        }
    },
    async newCard(client, channel, guild) {
        let data = {};
        for (let i = 0; i <= 2; i++) {
            let min = 1;
            if (i == 2) min = 5;
            data[i] = Math.floor(Math.random() * (50 - min + 1) + min);
        }

        let actuale = await Cards.findAll({
            where: {
                guildId: guild.id
            }
        });

        let actual = actuale.map(i => i.name);
        let crea;

        if (actuale.length >= 75) {
            const availableCards = await Cards.findAll({
                where: {
                    guildId: guild.id,
                    [Op.or]: [
                        { proprio: null },
                        { proprio: false },
                    ],
                },
            });

            const randomIndex = Math.floor(Math.random() * availableCards.length);
            crea = availableCards[randomIndex];

            if (crea) {
                await sendstats(channel, crea);
            } else {
                channel.send(":x: Il n'y a plus de cartes disponibles, pour en avoir plus vous pouvez reset le serveur ou acheter une extension sur le support du bot !").catch(e => console.log(e));
            }
        } else {
            crea = items.creature.find(u => !actual.includes(u.name));

            let card = {
                name: crea.name,
                guildId: guild.id,
                avatar: crea.avatar,
                attaque: data[0],
                defense: data[1],
                vie: data[2],
                proprio: null
            };

            await Cards.create(card);
            sendstats(channel, card);
        }

        function sendstats(channel, card) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${card.name}`)
                .addFields([
                    { name: `Puissance`, value: `\`\`\`js\n${card.vie + card.defense + card.attaque}/150\`\`\`` },
                    { name: `Attaque`, value: `\`\`\`js\n${card.attaque}/50\`\`\`` },
                    { name: `Défense`, value: `\`\`\`js\n${card.defense}/50\`\`\`` },
                    { name: `Vie`, value: `\`\`\`js\n${card.vie}/50\`\`\`` }
                ])
                .setImage(card.avatar)
                .setFooter({ text: `${actuale.length}/75 cards generated` });

            let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId(`cardclaim-${card.name}`).setLabel("Récupérer la carte").setEmoji("🔘");
            let button_row = new Discord.ActionRowBuilder().addComponents([button_back]);
            channel.send({ embeds: [embed], components: [button_row] });
        }
    },
    async generateCanva(card, text, color) {
        const canvas = Canvas.createCanvas(1024, 512);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(card.avatar);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.font = applyText(canvas, text);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, canvas.width / 2.5, canvas.height / 1.8);

        ctx.strokeStyle = `${color}`; //Nuance de bleu
        ctx.strokeRect(0, 0, canvas.width - 1, canvas.height - 1);

        ctx.beginPath();
        const attachment = new Discord.MessageAttachment(
            canvas.toBuffer(),
            "attach.png",
        )
        return attachment
        function applyText(canvas, text) {
            const context = canvas.getContext('2d');

            // Declare a base size of the font
            let fontSize = 70;

            do {
                // Assign the font to the context and decrement it so it can be measured again
                context.font = `bold ${fontSize -= 10}px Serif`;
                context.textAlign = 'center';
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (context.measureText(text).width > canvas.width - 300);

            // Return the result to use in the actual canvas
            return context.font;
        }
    },
    removeItems(arr, item) {
        for (var i = 0; i < item; i++) {
            arr.pop();
        }
        return arr
    },
    verifnum(money) {
        return /^[1-9]\d*$/.test(money);
    },
    removeNonLetters(text) {
        return (text.replace(/[^A-Za-z]/g, '')).toLowerCase()
    },
    async owner(client, id) {
        const config = client.config
        if (config.owner.includes(id)) return false
        const botDB = await Bots.findOne({
            where: {
                botid: client.user.id
            }
        });
        if (!botDB) return true
        let actualowners = JSON.parse(botDB.Owners) || {}
        if (!actualowners[id]) { return true } else return false
    },
    async wl(client, id) {
        const config = client.config
        if (config.owner.includes(id)) return false
        const botDB = await Bots.findOne({
            where: {
                botid: client.user.id
            }
        });
        if (!botDB) return true
        let actualowners = JSON.parse(botDB.Owners) || {}
        let actualwhitelist = JSON.parse(botDB.Whitelist) || {}
        if (!actualowners[id] && !actualwhitelist[id]) { return true } else return false
    },
    async wlog(user, color, guild, msg, command) {
        let guildDB = await checkGuild(false, guild.id)
        if (!guildDB) return
        let lchannel = guildDB.Logs["transaction"] || {}
        if (!lchannel) return;
        let asend = guild.channels.cache.get(lchannel)
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setTitle(command)
            .setDescription(msg ? msg : `${user.username} viens de gagner des coins`)
            .setColor(color ? color : 'GREEN')
            .setTimestamp()
        if (asend) {
            asend.send({ embeds: [embed] }).catch(e => { })
        }
    },
    webhook(error, message) {
        const webhook = new Discord.WebhookClient({ id: config.webhookerror.id, token: config.webhookerror.token })
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(`\`\`\`js\n${error}\`\`\``)
            .setColor('2F3136')
            .setFooter({ text: `ID: ${message.guild.id}` })
            .setTimestamp()
        webhook.send({ embeds: [embed] })
    },
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    msToTime(duration) {
        var seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        let timeString = "";

        if (hours) {
            timeString += `${hours} heure${hours > 1 ? "s" : ""}, `;
        }
        if (minutes) {
            timeString += `${minutes} minute${minutes > 1 ? "s" : ""}`;
        }
        if (seconds && !hours && !minutes) {
            timeString += `${seconds} seconde${seconds > 1 ? "s" : ""}`;
        }

        return timeString;
    }

}