var items = require('../../Utils/Functions/shop.json')
const Discord = require("discord.js");

const cooldownsReputation = new Map();

exports.help = {
    name: 'mobil',
    aliases: ['phone' , 'mobile' , 'blanchir'],
    description: 'Permets de gérer des affaires... illégales',
    use: 'mobil',
    category: 'Illegal'
  }
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).blanchisseur;
    let memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
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
        let capacite = memberDB.capacite
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
            .setImage("https://media.discordapp.net/attachments/1249042420163674153/1250157045064138752/unknown.png?ex=6669eafa&is=6668997a&hm=96bb9583b5917950ad70c9294ec713787492481dc93af8547588a40c6c8d842b&=&format=webp&quality=lossless&width=590&height=1180")
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
                    select.followUp({ content: `Le prix de la 💊 est actuellement de \`${JSON.parse(data.gain).drug} coins\` !\n_Le prix change régulièrement_`, ephemeral: true })
                }
                if (value == 'drugs') {
                    memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
                    select.followUp({ content: `Vous avez actuellement \`${memberDB.drugs} 💊\` !`, ephemeral: true })
                }
                if (value == 'tel') {
                    memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
                    if (!memberDB.drugs || parseInt(memberDB.drugs) <= 0) return select.followUp({ content: `:x: Vous n'avez pas assez de 💊`, ephemeral: true })
                    let msgfilter = m => m.author.id == message.author.id;
                    select.followUp({ content: `:eyes: Veuillez mentionner un membre à qui vous souhaitez envoyer \`1 💊\`:`, ephemeral: true }).then(async m => {
                        await m.channel.awaitMessages({ filter: msgfilter, max: 1, time: 100000, errors: ['time'] }).then(async cld => {
                            var msg = cld.first();
                            let member = msg.mentions.members.first() || message.guild.members.cache.get(msg.content)
                            msg.delete().catch(e => { })
                            if (!member || member.user.bot) return select.followUp({ content: ":x: `ERROR:` Pas de membre trouvé !", ephemeral: true })
                            let targetuser = bot.functions.checkUser(bot, message, args, member.id)
                            bot.functions.removeCoins(bot, message, args, message.author.id, 1, 'drugs')
                            bot.functions.addCoins(bot, message, args, member.id, 1, 'drugs')
                            select.followUp({ content: `Vous venez de donner \`1 💊\` à ${member.user.username}`, ephemeral: true })
                            return member.send(`${message.author.tag} vous a envoyé \`1 💊\` sur \`${message.guild.name}\` !`)
                        })
                    })
                }
                if (value == 'sell') {
                    memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
                    if (memberDB.capacite === "blanchisseur") {
                        if (cooldownsReputation.has(message.author.id)) {
                            const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
                            const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);
                    
                            if (remainingCooldown > 0) {
                                const hours = Math.floor(remainingCooldown / 3600);
                                const minutes = Math.floor((remainingCooldown % 3600) / 60);
                                const seconds = Math.floor(remainingCooldown % 60);
                    
                                const CouldownEmbed = new Discord.EmbedBuilder()
                                .setDescription(`:x: Vous avez déjà \`blanchisseur\`\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
                                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                                .setColor(data.color)
                    
                                return message.reply({ embeds: [CouldownEmbed] });
                            }
                        }
                        if (!memberDB.drugs || parseInt(memberDB.drugs) <= 0) return select.followUp({ content: `:x: Vous n'avez pas assez de 💊`, ephemeral: true })
                        let drugsprice = parseInt(JSON.parse(data.gain).drug)
                        cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
                        let gain = memberDB.drugs * drugsprice
                        bot.functions.removeCoins(bot, message, args, message.author.id, memberDB.drugs, 'drugs')
                        bot.functions.addCoins(bot, message, args, message.author.id, gain, 'coins')
                        select.followUp({ content: `Vous venez de vendre \`${memberDB.drugs || 0} 💊\` pour \`${gain} coins\` !`, ephemeral: true })

                    } else select.followUp({
                        embeds: [new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:x: Vous devez avoir la capacité **blanchisseur** pour utiliser cette commande !`)], ephemeral: true
                    })
                }
                if (value == 'blanchisseur') {
                    memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
                    let blprice = JSON.parse(data.gain).blanchisseur
                    let Embed = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:x: Vous avez besoin de ${blprice} réputations pour devenir un **blanchisseur**`);
                    if (parseInt(JSON.parse(memberDB.coins).rep) < parseInt(blprice)) return select.followUp({ embeds: [Embed], ephemeral: true })

                    if (memberDB.capacite === "blanchisseur") return select.followUp({ content: `:x: Vous êtes déjà un **blanchisseur**`, ephemeral: true })
                        bot.db.prepare(`UPDATE user SET capacite = @coins WHERE id = @id`).run({ coins: 'blanchisseur', id: message.author.id});
                    let Embed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:white_check_mark: Vous avez obtenu la capacité **blanchisseur** pour \`${blprice} rep\` et pouvez désormais convertir les :pill: en :coin: !`);
                        bot.functions.removeCoins(bot, message, args, message.author.id, blprice, 'rep')
                    select.followUp({ embeds: [Embed2], ephemeral: true })
                }
                if (value == 'cultivateur') {
                    memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
                    let culprice = JSON.parse(data.gain).cultivateur || items.capacite.cultivateur.price
                    let Embed = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:x: Vous avez besoin de ${culprice} réputations pour être **cultivateur** !`);

                        if (parseInt(JSON.parse(memberDB.coins).rep) < parseInt(culprice)) return select.followUp({ embeds: [Embed], ephemeral: true })
                    if (memberDB.capacite === "cultivateur") return select.followUp({ content: `:x: Vous êtes déjà un **cultivateur**`, ephemeral: true })
                        bot.db.prepare(`UPDATE user SET capacite = @coins WHERE id = @id`).run({ coins: 'cultivateur', id: message.author.id});
                    bot.functions.removeCoins(bot, message, args, message.author.id, culprice, 'rep')
                    let Embed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:white_check_mark: Vous avez obtenu la capacité **cultivateur** pour \`${culprice} rep\` et débloquez la commande \`recolt\` !`);
                    select.followUp({ embeds: [Embed2], ephemeral: true })
                }
                if (value == 'demission') {
                    memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
                    if (!memberDB.capacite) return select.followUp({ content: `:x: Vous n'avez pas de capacité !`, ephemeral: true })
                        bot.db.prepare(`UPDATE user SET capacite = @coins WHERE id = @id`).run({ coins: null, id: message.author.id});
                    let Embed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:white_check_mark: Vous avez abandonné votre capacité **${capacite}** !`);
                    select.followUp({ embeds: [Embed2], ephemeral: true })
                }
            })
        })  
}