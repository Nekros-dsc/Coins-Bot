const Discord = require("discord.js");
const { Bots } = require("../../base/Database/Models/Bots");
module.exports = {
    name: "apikey",
    description: "Envois la clef d'API pour vous connecter aux coins de votre serveur",
    cooldown: 2,

    run: async (client, message, args, data) => {

        const botDB = await Bots.findOne({
            where: {
                botid: client.user.id
            }
        });
        if (!botDB) return message.reply(":warning: Votre bot n'est pas inscrit dans la base de donnée d'EpicBots, veuillez contacter le support ! ")
        const founder = client.config.owner
        if (founder.includes(message.author.id)) {
            let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('yes').setEmoji("✅").setLabel(`Oui`)

            let button_row = new Discord.ActionRowBuilder().addComponents([button_back])

            return message.reply({
                content: `:question: Êtes-vous sûr de vouloir regénérer la clef d'API du serveur ?`,
                components: [button_row],
                allowedMentions: { repliedUser: false }
            }).then(m => {

                const collector = m.createMessageComponentCollector({
                    componentType: Discord.ComponentType.Button,
                    time: 30000
                })
                collector.on("collect", async (i) => {
                    if (i) {
                        if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ce bouton !", ephemeral: true }).catch(() => { })
                        await i.deferUpdate()

                        if (i.customId === 'yes') {
                            collector.stop()
                            let token = await gentoken()
                            data.guilds.update(
                                { APIkey: token },
                                { where: { guildId: message.guild.id } }
                            );
                            return i.followUp({ content: `:key: La clef du serveur a été régénéré, la voici: ||\`${token}\`||`, ephemeral: true })
                        } else {
                            collector.stop()
                        }
                    }
                })
                collector.on("end", async () => {
                    button_row.components[0].setDisabled(true);
                    return m.edit({ components: [button_row] }).catch(() => { })
                })
            })
        } else message.reply(":x: Vous devez être `buyer` du bot pour utiliser cette commande")
    }
}
function gentoken() { return [...Array(34)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') }