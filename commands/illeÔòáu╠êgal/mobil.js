const Discord = require("discord.js");
const getUser = require("../../base/functions/getUser");
const setCooldown = require("../../base/functions/setCooldown");
var items = require("../../shop.json");

module.exports = {
    name: "mobil",
    description: "Permets de gérer des affaires... illégales",
    usage: "mobil",
    cooldown: 4,
    aliases: ['phone', "mobile", "blanchir"],

    run: async (client, message, args, data) => {
        let memberDB = await getUser(message.member.id, message.guild.id)
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Ouvrir une application')
                    .addOptions([
                        {
                            label: 'Bourse',
                            description: 'Affiche le prix actuel de la 💊',
                            emoji: '💰',
                            value: 'bourse',
                        },
                        {
                            label: 'Drugs',
                            description: 'Affiche votre nombre de 💊',
                            emoji: '💊',
                            value: 'drugs',
                        },
                        {
                            label: 'Téléphone',
                            description: 'Permets de donner une 💊',
                            emoji: '📱',
                            value: 'tel',
                        },
                        {
                            label: 'Contactes',
                            description: 'Permets de revendre tous ses 💊',
                            emoji: '💸',
                            value: 'sell',
                        },

                    ]),
            );
        let capacite = memberDB.Capacite
        if (capacite !== "cultivateur") {
            row.components[0].addOptions([{
                label: 'Twitter',
                description: 'Permets de devenir cultivateur',
                emoji: '🐦',
                value: 'cultivateur',
            },]);
        }
        if (capacite !== "blanchisseur") {
            row.components[0].addOptions([{
                label: 'Messages',
                description: 'Permets de devenir blanchisseur',
                emoji: '💬',
                value: 'blanchisseur',
            },]);
        }
        if (capacite === "blanchisseur" || capacite === "cultivateur") {
            row.components[0].addOptions([{
                label: 'Reddit',
                description: 'Permets de perdre sa capacité',
                emoji: '🤖',
                value: 'demission',
            },]);
        }
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `Téléphone de ${message.author.username}` })
            .setColor(data.color)
            .setImage("https://media.discordapp.net/attachments/931284573306892348/998890205614456862/unknown.png")
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, components: [row] }).then(msg => {
            const collector = msg.createMessageComponentCollector({
                componentType: Discord.ComponentType.SelectMenu,
                time: 150000
            })
            collector.on("collect", async (select) => {
                if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                const value = select.values[0]
                await select.deferUpdate()
                if (value == 'bourse') {
                    select.followUp({ content: `Le prix de la 💊 est actuellement de \`${data.guild.DrugPrice} coins\` !\n_Le prix change régulièrement_`, ephemeral: true })
                }
                if (value == 'drugs') {
                    memberDB = await getUser(message.member.id, message.guild.id)
                    select.followUp({ content: `Vous avez actuellement \`${memberDB.Drugs} 💊\` !`, ephemeral: true })
                }
                if (value == 'tel') {
                    memberDB = await getUser(message.member.id, message.guild.id)
                    if (!memberDB.Drugs || parseInt(memberDB.Drugs) <= 0) return select.followUp({ content: `:x: Vous n'avez pas assez de 💊`, ephemeral: true })
                    let msgfilter = m => m.author.id == message.author.id;
                    select.followUp({ content: `:eyes: Veuillez mentionner un membre à qui vous souhaitez envoyer \`1 💊\`:`, ephemeral: true }).then(async m => {
                        await m.channel.awaitMessages({ filter: msgfilter, max: 1, time: 100000, errors: ['time'] }).then(async cld => {
                            var msg = cld.first();
                            let member = msg.mentions.members.first() || message.guild.members.cache.get(msg.content)
                            msg.delete().catch(e => { })
                            if (!member || member.user.bot) return select.followUp({ content: ":x: `ERROR:` Pas de membre trouvé !", ephemeral: true })
                            let targetuser = await getUser(member.id, message.guild.id)
                            memberDB.decrement('Drugs', { by: 1 });
                            targetuser.increment('Drugs', { by: 1 });
                            select.followUp({ content: `Vous venez de donner \`1 💊\` à ${member.user.tag}`, ephemeral: true })
                            return member.send(`${message.author.tag} vous a envoyé \`1 💊\` sur \`${message.guild.name}\` !`)
                        })
                    })
                }
                if (value == 'sell') {
                    memberDB = await getUser(message.member.id, message.guild.id)
                    if (memberDB.Capacite === "blanchisseur") {
                        if (!(await setCooldown(message, data.color, message.member.id, message.guild.id, "blanchisseur", 18000000, true))) return
                        if (!memberDB.Drugs || parseInt(memberDB.Drugs) <= 0) return select.followUp({ content: `:x: Vous n'avez pas assez de 💊`, ephemeral: true })
                        let drugsprice = parseInt(data.guild.DrugPrice)
                        if (!(await setCooldown(message, data.color, message.member.id, message.guild.id, "blanchisseur", 18000000))) return
                        let gain = memberDB.Drugs * drugsprice
                        memberDB.decrement('Drugs', { by: memberDB.Drugs });
                        memberDB.increment('Coins', { by: gain });
                        select.followUp({ content: `Vous venez de vendre \`${memberDB.Drugs || 0} 💊\` pour \`${gain} coins\` !`, ephemeral: true })

                    } else select.followUp({
                        embeds: [new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:x: Vous devez avoir la capacité **blanchisseur** pour utiliser cette commande !`)], ephemeral: true
                    })
                }
                if (value == 'blanchisseur') {
                    memberDB = await getUser(message.member.id, message.guild.id)
                    let blprice = data.guild.Prices["blanchisseurprice"] || items.capacite.blanchisseur.price
                    let Embed = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:x: Vous avez besoin de ${blprice} réputations pour devenir un **blanchisseur**`);
                    if (parseInt(memberDB.Rep) < parseInt(blprice)) return select.followUp({ embeds: [Embed], ephemeral: true })

                    if (memberDB.Capacite === "blanchisseur") return select.followUp({ content: `:x: Vous êtes déjà un **blanchisseur**`, ephemeral: true })
                    memberDB.update({Capacite: "blanchisseur"}, { where: { primary: memberDB.primary }})
                    let Embed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:white_check_mark: Vous avez obtenu la capacité **blanchisseur** pour \`${blprice} rep\` et pouvez désormais convertir les :pill: en :coin: !`);
                    memberDB.decrement('Rep', { by: blprice });
                    select.followUp({ embeds: [Embed2], ephemeral: true })
                }
                if (value == 'cultivateur') {
                    memberDB = await getUser(message.member.id, message.guild.id)
                    let culprice = data.guild.Prices["cultivateurprice"] || items.capacite.cultivateur.price
                    let Embed = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:x: Vous avez besoin de ${culprice} réputations pour être **cultivateur** !`);

                        if (parseInt(memberDB.Rep) < parseInt(culprice)) return select.followUp({ embeds: [Embed], ephemeral: true })
                    if (memberDB.Capacite === "cultivateur") return select.followUp({ content: `:x: Vous êtes déjà un **cultivateur**`, ephemeral: true })
                    memberDB.update({Capacite: "cultivateur"}, { where: { primary: memberDB.primary }})
                    memberDB.decrement('Rep', { by: culprice });
                    let Embed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:white_check_mark: Vous avez obtenu la capacité **cultivateur** pour \`${culprice} rep\` et débloquez la commande \`recolt\` !`);
                    select.followUp({ embeds: [Embed2], ephemeral: true })
                }
                if (value == 'demission') {
                    memberDB = await getUser(message.member.id, message.guild.id)
                    if (!memberDB.Capacite) return select.followUp({ content: `:x: Vous n'avez pas de capacité !`, ephemeral: true })
                    memberDB.update({Capacite: null}, { where: { primary: memberDB.primary }})
                    let Embed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:white_check_mark: Vous avez abandonné votre capacité **${capacite}** !`);
                    select.followUp({ embeds: [Embed2], ephemeral: true })
                }
            })
        })


    }
}